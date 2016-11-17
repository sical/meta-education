#!/usr/bin/env python
# -*- coding: utf-8 -*-

import string
import json
import random
import os
import pymongo

# connect to mongo
client = pymongo.MongoClient('localhost', 27017)
db = client["metaEducation"]

res = db.statements.aggregate([
    { "$match" : { "actor.account.name" : { "$exists" : 1 } } },
    { "$group" : {
        "_id" : "$actor.account.name",
        "names" : { "$addToSet" : "$actor.name" }
        }
    }
])

names = []
for names_list in list(res):
    name_match = [ n for n in names_list["names"] if n != names_list["_id"] ]
    if len(name_match) > 0 and len(name_match) < 2:
        name = name_match[0].encode('utf-8')

        if "Élève" in name :
            classe = name.replace("Élève ", "")[:-2]

            prof = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))

            names.append( {
                "name" :name,
                "classe" : classe,
                "classeId" : classe,
                "id"  : names_list ["_id"],
                "professeur" : prof
            })
#
for n in sorted(names, key=lambda x: x["name"], reverse=True):
    print n["name"]

with open("data/users.json", "wb") as f :
    json.dump({ "users" : names },f, indent=2)
