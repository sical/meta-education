#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    This will crawl the last 30 days
    bin/crawler -d 30 -s '2016-12-10 16:45:00.12'
"""

import sys
import argparse
import datetime

from crawler import get_records_from_xapi, save_statements_to_mongos,reset_statements_db
from parser import reset_actions_db, extract_networks_from_statements, save_actions_to_mongos


# timeframe to fetch and process data
# start = datetime(2016, 10, 18, 11, 50, 0)
# end = datetime(2016, 10, 18, 22, 5, 0)

def crawl_and_save_records(start, end):
    # init for crawler
    has_more_records = True
    offset = 0

    # reset local data
    reset_statements_db()
    reset_actions_db()

    # get all statements from xAPI into mongo
    while has_more_records:
        resp = get_records_from_xapi(start, end, offset=offset)
        save_statements_to_mongos(resp["statements"])
        offset = offset + 500
        if resp["more"] == "" :
            has_more_records = False

    actions = extract_networks_from_statements(start, end)
    if actions : save_actions_to_mongos(actions)


def parse_args():
    # parse command line arguments
    p = argparse.ArgumentParser()
    p.add_argument('--start', '-s', default=None, help='Crawling start time - format ')
    p.add_argument('--duration', '-d', default=None, help='Duration until crawl final timestamp (number of days)')

    return p

def main():

    # parse cli
    parser = parse_args()
    args = parser.parse_args()

    if not args.start :
        start = datetime.datetime.now()
    else :
        start = datetime.datetime.now().strptime(args.start, '%Y-%m-%d %H:%M:%S.%f')

    if not args.duration :
        duration = datetime.timedelta(days=1)
    else :
        duration = datetime.timedelta(days=int(args.duration))

    end = start + duration

    print "Crawling data from '%s' to '%s' (%s days)"%(start, end, duration.days)

    # start crawling
    crawl_and_save_records(start, end)

if __name__ == '__main__':
    main()
