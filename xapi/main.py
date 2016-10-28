from crawler import get_records_from_xapi
from datetime import datetime
import urlparse

start = datetime(2016, 9, 1, 0, 0, 0)
end = datetime(2016, 10, 18, 22, 5, 0)

# init for crawler
has_more_records = True
offset = 0

while has_more_records:
    resp = get_records_from_xapi(start, end, offset=offset)
    offset = offset + 500
    if resp["more"] == "" :
        has_more_records = False
