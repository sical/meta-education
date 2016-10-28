# coding: utf-8

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
from pymongo import MongoClient
import networkx as nx

# import config
with open(os.path.join(os.getcwd(),"../config/config.json"),"rb") as f:
    config = json.load(f)

# connect to mongo
client = MongoClient('localhost', 27017)
db = client["metaEducation"]

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
        G.remove_node(data["_id"])
    elif element_type == "Edge" :
        G.remove_edge(data["from"], data["to"])
    else :
        raise ValueError("Wrong element type %s"%element_type)
    return G

def update_elements(G, element_type, data):
    """Update graph element attributes"""
    if element_type == "Node" :
        for change in data:
            G.node[data["_id"]][change] = data[change]
    elif element_type == "Edge" :
        for change in data:
            G.edge[data["_id"]][change] = data[change]
    else :
        raise ValueError("Wrong element type %s"%element_type)
    return G


def extract_networks_from_statements(start, end):
    # ### Parse networks data
    print "Extracting statements from Mongo..."

    # query for mongo
    q = { 'stored': {'$lt': end, '$gte': start} }

    print "%s results"%db.statements.find(q).count()
    print "-"*10

    # store different informations about the network
    networks = {}

    # container for all network states
    actions = {}

    # extract infos
    for statement in db.statements.find(q):

        # default state
        project_id=None

        # store action infos
        action = {}
        action["type"] = get_action(statement["verb"]["id"])
        action["ts"] = statement["stored"]

        if action["type"] in ["access","loggedin","viewed","close"] :
            pass # ignore those actions
        else :
            element_type = statement["object"]["definition"]["type"].split("#")[1]

            if element_type == "Renkan":

                if action["type"] == "create": # create new project
                    data = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]
                    new_id = data["id"]
                    networks[new_id] = nx.DiGraph()
                    actions[new_id] = []

            elif element_type == "View":
                pass

            elif element_type == "Node" or element_type == "Edge":

                data = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#Data"]
                project_id = data["project"]["id"]

                if action["type"] == "create":
                    create_elements(networks[project_id], element_type, data )

                elif action["type"] == "update" or action["type"] == "move" :
                    try:
                        data_changed = statement["object"]["definition"]["extensions"]["http://www-w3-org/ns/activitystreams#DataChanged"]
                        update_elements(networks[project_id], element_type, data_changed )
                    except KeyError:
                        pass # ignore if nothing in DataChanges
                elif action["type"] == "delete":
                    delete_elements(networks[project_id], element_type, data )

                action["element_type"] = element_type
                action["nodes"] = networks[project_id].nodes(data=True)
                action["edges"] = networks[project_id].edges(data=True)
                action["statement"] = statement
                action["project_id"] = project_id

                actions[project_id].append(action)

    print "%s projects found"%len(actions.keys())
    return actions

def save_actions_to_mongos(actions):
    # print some info about the graphs
    for i,network_id in enumerate(actions):
        print "## project %s"%network_id

        # save data points to db
        db.actions.insert_many(actions[ network_id ])

        # sort by time
        actions[ network_id ].sort(key=lambda c: c["ts"]) # sort by time
        ts = [ a["ts"] for a in actions[ network_id ]]
        diff = max(ts)-min(ts)
        minutes_seconds = divmod(diff.total_seconds(), 60)
        print "%d:%d min  - from %s to %s"%( minutes_seconds[0], minutes_seconds[1], min(ts), max(ts) )

        # show actions type count
        for c in Counter([a["type"] for a in actions[network_id]]).most_common() : print c[0], c[1]
        print "-"*10

        # log final state
        print "Final state: %s nodes and %s edges in %s actions"%(len(actions[network_id][-1]["nodes"]), len(actions[network_id][-1]["edges"]), len(actions[network_id]))

    print "%s actions stored"%db.actions.count()

def reset_actions_db():
    db.actions.drop()
    print "All actions dropped from Mongo."
