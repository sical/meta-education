#!/usr/bin/env python
# -*- coding: utf-8 -*-

# # Reconstruct from traces
#
# Purpose of this notebook :
#
# * Convert Tincan records to usable network images
# * Extract some first metrics
# * Create preliminary viz of the activity
# * Check test data
#
# Tincan/XAPI records have already been stored in MongoDB using a [custom xApi crawler script](https://github.com/sical/meta-education/blob/master/xapi/xapi-crawler.py)

import json
import os
import datetime
from collections import Counter
import pymongo
import networkx as nx
import logging

logger = logging.getLogger()


# import config
with open(os.path.join(os.getcwd(),"./config/config.json"),"rb") as f:
    config = json.load(f)

# connect to mongo
client = pymongo.MongoClient('localhost', 27017)
db = client["metaEducation"]

# ensure uniqueness
db.actions.ensure_index( [ ("id", pymongo.ASCENDING) ], unique=True )

# ### Parser functions
# Functions used to convert Tincan API answers into networks

def get_action(type):
    """Parse action type from Tincan API code"""
    action_codes = {
        "81" : "login",
        "284" : "login",
        "292" : "viewed",
        "144" : "search",
        "102" : "create",
        "103" : "delete",
        "160" : "update"
    }
    if type[-1] == "/":
        return type.split("/")[-2]
    else :
        code = type.split("/")[-1]
        try :
            int(code)
            return action_codes[code]
        except ValueError:
            return code

def get_project_id(data):
    """Retrieve project id from the data"""
    return data["project"]["id"]

# statements parsers
def create_elements(G, element_type, data):
    """Create a graph element with its attributes"""
    if element_type == "Node" :
        G.add_node(data["_id"], attr_dict=data)
    elif element_type == "Edge" :
        G.add_edge(data["from"], data["to"], attr_dict=data)
    else :
        raise ValueError("Wrong element type %s"%element_type)
    return G

def delete_elements(G, element_type, data):
    """Remove an element from the graph G"""
    if element_type == "Node" :
        if G.has_node(data["_id"]):
            G.remove_node(data["_id"])
    elif element_type == "Edge" :
        # prevent error raising from edges removed during nodes deletion
        if G.has_edge(data["from"], data["to"]) :
            G.remove_edge(data["from"], data["to"])
    else :
        raise ValueError("Wrong element type %s"%element_type)
    return G

def update_node(G, _id, data):
    """Update node attributes"""
    for change in data:
        G.node[_id][change] = data[change]
    return G

def update_edge(G, _from, _to, data):
    """Update graph element attributes"""
    for change in data:
        G.edge[_from][_to][change] = data[change]
    return G

def extract_networks_from_statements():
    # ### Parse networks data
    print
    print "#"*10
    # query for mongo
    # q = { 'stored': {'$lt': end, '$gte': start} }
    users = json.load(open('./data/users.json', 'r'))
    authorized_user_ids = [ u["id"].decode('utf-8') for u in users["users"]]

    print "Fetching data for %s authorized users..."%len(authorized_user_ids)
    q = { "actor.account.name" : { "$in" : authorized_user_ids } }
    c = db.statements.find(q).count()

    if not c:
        print "No records in DB"
        return

    print "%s statements in the DB"%c
    print "-"*10

    print "Extracting statements from Mongo..."
    # store different informations about the network
    networks = {}

    # container for all network states
    actions = {}

    # store info about other actions
    ignored = []

    # extract infos
    for i,statement in enumerate(db.statements.find(q).sort([ ( 'stored', 1 ) ])):

        # default state
        project_id=None

        # store action infos
        action = {}
        action["type"] = get_action(statement["verb"]["id"])
        action["ts"] = statement["stored"]
        action["id"] = statement["id"]

        action_log = "%i/%s :%s  - %s -- %s"%(i,c,action["type"], action["ts"], action["id"])

        if action["type"] in ["access","loggedin","viewed","close", "attempted", "experienced"] :
            logger.debug(action_log)
            ignored.append(action["type"])
            pass # ignore those actions
        else :
            element_type = statement["object"]["definition"]["type"].split("#")[1]

            logger.debug("%s -- %s"%(action_log, element_type))

            if element_type == "Renkan":

                if action["type"] == "create": # create new project
                    data = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]
                    new_id = data["id"]
                    networks[new_id] = nx.DiGraph()
                    actions[new_id] = []

                    # "Create new Renkan !"
                elif action["type"] == "update":
                    ignored.append("Renkan " + action["type"])
                    pass

            elif element_type == "View":
                ignored.append("View " + action["type"])

            elif element_type == "Node" or element_type == "Edge":

                data = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]
                project_id = data["project"]["id"]
                action["project_name"] = data["project"]["title"]

                if project_id in networks.keys(): # ignore graphs that were not created properly with Renkan/Create

                    if action["type"] == "create":
                        create_elements(networks[project_id], element_type, data )
                    elif action["type"] == "update" or action["type"] == "move" :

                        data_changed = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#DataChanged"]

                        if element_type == "Node":
                            _id = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]["_id"]

                            if networks[project_id].has_node( _id):
                                update_node(networks[project_id], _id, data_changed)

                        if element_type == "Edge":
                            _from = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]["from"]
                            _to = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]["to"]
                            if networks[project_id].has_edge( _from, _to):
                                # print project_id, action["id"]
                                update_edge(networks[project_id], _from, _to, data_changed)

                    elif action["type"] == "delete":
                        delete_elements(networks[project_id], element_type, data )

                    action["element_type"] = element_type
                    action["nodes"] = networks[project_id].nodes(data=True)
                    action["edges"] = networks[project_id].edges(data=True)
                    action["statement"] = statement
                    action["project_id"] = project_id

                    # actions are stored only for networks
                    actions[project_id].append(action)
                else :
                    logger.debug("Action ignored : not in known networks")

    print "%s projects found"%len(actions.keys())
    print "ignored actions : %s"%Counter(ignored).most_common()
    return actions

def save_actions_to_mongos(actions):
    # print some info about the graphs
    for i,network_id in enumerate(actions):
        logger.debug("## project %s"%network_id)

        # save data points to db
        if len(actions[ network_id ]):
            try :
                res = db.actions.insert_many(actions[ network_id ])
                logger.debug("%s new records."%len(res.inserted_ids))
            except pymongo.errors.BulkWriteError as e:
                logger.debug("%s new records."%e.details['nInserted'])

            # sort by time
            actions[ network_id ].sort(key=lambda c: c["ts"]) # sort by time
            ts = [ a["ts"] for a in actions[ network_id ]]
            diff = max(ts)-min(ts)
            minutes_seconds = divmod(diff.total_seconds(), 60)
            logger.debug("%d:%d min  - from %s to %s"%( minutes_seconds[0], minutes_seconds[1], min(ts), max(ts) ))

            # show actions type count
            counter = ""
            for c in Counter([a["type"] for a in actions[network_id]]).most_common() :
                counter = counter + "%s : %s / "%(c[0], c[1])
            logger.debug(counter)

            # log final state
            logger.debug("Final state: %s nodes and %s edges in %s actions"%(len(actions[network_id][-1]["nodes"]), len(actions[network_id][-1]["edges"]), len(actions[network_id])))
        else :
            logger.debug('No actions detected.')

        logger.debug("-"*10)

    print "%s relevant actions on networks in the database"%db.actions.count()

def reset_actions_db():
    db.actions.drop()
    print "All actions dropped from Mongo."
