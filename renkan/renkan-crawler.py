import requests
import json
import os

# ids = ["6e2b14ed-3977-4612-9047-12a91f54d043", "72028859-90f1-454a-ad8a-17d7351780bc"]
ids= ["6e2b14ed-3977-4612-9047-12a91f54d043"]
base_url = "http://renkan.iri-research.org/renkan/rest/projects/"

for id in ids:
    url = base_url+id
    print "crawling at %s..."%url
    r = requests.get(url)

    # remove nasty eval from original JSON
    json_data = r.content[len("callback("):-1]

    # make sure of json compliance
    parsed = json.loads(json_data)

    # create dir to store files
    data_dir = os.path.join(os.getcwd(), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    # dumps JSON to file
    with open(os.path.join( data_dir, "%s.json"%id), "w") as f:
        json.dump(parsed, f, indent=4, sort_keys=True)
