import json
import os
from tincan import RemoteLRS
from pymongo import MongoClient
from datetime import datetime
from django.utils.dateparse import parse_datetime

# import config
with open(os.path.join(os.getcwd(),"../config/config.json"),"rb") as f:
    config = json.load(f)

# connect to mongo
client = MongoClient('localhost', 27017)
db = client["metaEducation"]

# reset to zero
db.statements.drop()
print "All records deleted in Mongo."

# construct an LRS
print "Connecting to the LRS..."
lrs = RemoteLRS(
    endpoint="https://xapi.neteduc-cloud.fr/public/data/xAPI/",
    username=config["xapi"]["username"],
    password=config["xapi"]["password"],
)
print "...done"

# query
q = {
	"since": "2016-09-08T13:00:00Z",
	"until": "2016-09-08T13:50:00Z",
	"ascending": True,
	"limit": 2500
}

response = lrs.query_statements(q)
if not response:
    raise ValueError("statements could not be queried")


# parse JSON from API
parsed = json.loads(response.data)

# remove dots in key because mongo does not support them
def convert_dots_to_dash_in_dict(d):
    new = {}
    if not isinstance(d, datetime):
        for k, v in d.iteritems():
            if isinstance(v, dict):
                v = convert_dots_to_dash_in_dict(v)
            new[k.replace('.', '-')] = v
    return new

clean_statements = [ convert_dots_to_dash_in_dict(s) for s in parsed["statements"]]

for statement in clean_statements:
    statement["stored"] = parse_datetime(statement["stored"])
    statement["timestamp"] = parse_datetime(statement["timestamp"])

# dump to mongo
db.statements.insert_many(clean_statements)
print "%s statements saved in Mongo."%len(parsed["statements"])

# # create dir to store files
# data_dir = os.path.join(os.getcwd(), "data")
# if not os.path.exists(data_dir):
#     os.makedirs(data_dir)
# print "data will be stored in %s"%data_dir

# with open(os.path.join( data_dir, "%s.json"%id), "w") as f:
#     json.dump(parsed, f, indent=4, sort_keys=True)
