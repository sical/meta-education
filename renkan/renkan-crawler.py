import requests
import json
import os

# NTB networks
ids= [
"8c16701a-a0f7-4fc4-b811-e39bec7d25bf",
"6e2b14ed-3977-4612-9047-12a91f54d043",
"d550d83c-b656-4621-b28d-469b94ec95f4",
"72028859-90f1-454a-ad8a-17d7351780bc",
"5b058c18-bae1-40ae-ae40-346f3bbf6bed",
"db2212a1-a04f-11e2-8343-2d44aceface5",
"57b2186d-c87d-47bd-b302-294d422a0f2c",
"6f907ccd-1cd3-4de8-944c-c9df2e6cb55f"
]

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
