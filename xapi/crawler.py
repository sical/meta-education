import json
import os
from xAPIClient import xAPIClient
import pymongo
from datetime import datetime
from django.utils.dateparse import parse_datetime
import logging

logger = logging.getLogger()

# import config
with open(os.path.join(os.getcwd(),"./config/config.json"),"rb") as f:
    config = json.load(f)

# connect to mongo
client = pymongo.MongoClient('localhost', 27017)
db = client["metaEducation"]

# index to ensure unicity of documents
db.statements.ensure_index( [ ("id", pymongo.ASCENDING) ], unique=True )
# db.statements.ensure_index( [ ("timestamp", pymongo.ASCENDING)] )
db.statements.ensure_index( [ ("stored", pymongo.ASCENDING) ] )
db.statements.ensure_index( [ ("stored", pymongo.DESCENDING) ] )

# construct an LRS
print "Connecting to the LRS..."
lrs = xAPIClient(
    endpoint="https://xapi.neteduc-cloud.fr/public/data/xAPI/",
    username=config["xapi"]["username"],
    password=config["xapi"]["password"],
)
print "...done"


DATE_FORMAT = '%Y-%m-%dT%H:%M:%SZ'

def get_db_time_range():
    first = db.statements.find().sort([("timestamp",1)]).limit(1)
    last = db.statements.find().sort([("timestamp",-1)]).limit(1)

    if first.count(True) == 1 and last.count(True) == 1 :
        return first[0]["timestamp"], last[0]["timestamp"]
    else :
        return [None, None]

def get_records_from_xapi(start, end, offset=0):
    """Query xApi and return statements"""
    assert type(end) is datetime
    assert type(start) is datetime

    logger.debug("Crawling data from '%s' to '%s' / offset : %s"%(start, end, offset))

    # query
    q = {
    	"since": datetime.strftime(start, DATE_FORMAT),
    	"until": datetime.strftime(end, DATE_FORMAT),
    	"ascending": True,
        "limit" : 100,
        "offset" : offset
    }

    data = lrs.get_statements(q)
    logger.debug("got %s statements from xAPI"%len(data["statements"]))
    return data

# remove dots in key because mongo does not support them
def convert_dots_to_dash_in_dict(d):
    new = {}
    if not isinstance(d, datetime):
        for k, v in d.iteritems():
            if isinstance(v, dict):
                v = convert_dots_to_dash_in_dict(v)
            new[k.replace('.', '-')] = v
    return new

def save_statements_to_mongos(statements):

    # fix unsupported characters in object key
    clean_statements = [ convert_dots_to_dash_in_dict(s) for s in statements]

    # parse values
    for statement in clean_statements:
        statement["stored"] = parse_datetime(statement["stored"])
        statement["timestamp"] = parse_datetime(statement["timestamp"])

    # dump data to mongo
    if len(statements):
        try :
            res = db.statements.insert_many(clean_statements)
            return len(res.inserted_ids)
        except pymongo.errors.BulkWriteError as e:
            return e.details['nInserted']
    else:
        print "No records found."
        return 0

def reset_statements_db():
    # reset to zero
    db.statements.drop()
    print "All records deleted in Mongo."
