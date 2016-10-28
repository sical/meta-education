from crawler import get_records_from_xapi, save_statements_to_mongos,reset_statements_db
from parser import reset_actions_db, extract_networks_from_statements, save_actions_to_mongos
from datetime import datetime
import urlparse

# timeframe to fetch and process data
start = datetime(2016, 10, 18, 11, 50, 0)
end = datetime(2016, 10, 18, 22, 5, 0)



# # init for crawler
# has_more_records = True
# offset = 0
#
# # reset local data
# reset_statements_db()
# reset_actions_db()
#
# # get all statements from xAPI into mongo
# while has_more_records:
#     resp = get_records_from_xapi(start, end, offset=offset)
#     save_statements_to_mongos(resp["statements"])
#     offset = offset + 500
#     if resp["more"] == "" :
#         has_more_records = False

actions = extract_networks_from_statements(start, end)
save_actions_to_mongos(actions)
