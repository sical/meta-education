import json

def save_to_json_file(data, filename)
    # create dir to store files
    data_dir = os.path.join(os.getcwd(), "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    print "data will be stored in %s"%data_dir

    # write data to file
    with open(os.path.join( data_dir, "%s.json"%filename), "w") as f:
        json.dump(data, f, indent=4, sort_keys=True)
