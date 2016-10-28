import json
import os
from xAPIClient import xAPIClient
from pymongo import MongoClient
from datetime import datetime
from django.utils.dateparse import parse_datetime

# import config
with open(os.path.join(os.getcwd(),"../config/config.json"),"rb") as f:
    config = json.load(f)

# connect to mongo
client = MongoClient('localhost', 27017)
db = client["metaEducation"]

# construct an LRS
print "Connecting to the LRS..."
lrs = xAPIClient(
    endpoint="https://xapi.neteduc-cloud.fr/public/data/xAPI/",
    username=config["xapi"]["username"],
    password=config["xapi"]["password"],
)
print "...done"


DATE_FORMAT = '%Y-%m-%dT%H:%M:%SZ'

def get_records_from_xapi(start, end, offset=0):
    """Query xApi and return statements"""
    assert type(end) is datetime
    assert type(start) is datetime

    # query
    q = {
    	"since": datetime.strftime(start, DATE_FORMAT),
    	"until": datetime.strftime(end, DATE_FORMAT),
    	"ascending": True,
        "limit" : 500,
        "offset" : offset
    }

    data = lrs.get_statements(q)
    print data["more"]
    print "got %s statements from xAPI"%len(data["statements"])
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
    db.statements.insert_many(clean_statements)
    print "%s statements saved in Mongo. total : %s"%(db.statements.count(), len(statements))


def reset_statements_db():
    # reset to zero
    db.statements.drop()
    print "All records deleted in Mongo."
