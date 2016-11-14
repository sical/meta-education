#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    This will crawl the last 30 days
    bin/crawler -d 30 -s '2016-12-10 16:45:00.12'
"""

import sys
import argparse
import datetime

from crawler import get_records_from_xapi, save_statements_to_mongos,reset_statements_db, get_db_time_range
from parser import reset_actions_db, extract_networks_from_statements, save_actions_to_mongos

import logging

# logs
logname="meta-education.log"
logging.basicConfig(filename=logname,
                            filemode='a',
                            format='%(asctime)s,%(msecs)d %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.DEBUG)

logger = logging.getLogger()

# timeframe to fetch and process data
# start = datetime(2016, 10, 18, 11, 50, 0)
# end = datetime(2016, 10, 18, 22, 5, 0)

def crawl_and_save_records(start, end):
    # init for crawler
    has_more_records = True
    offset = 0

    # reset local data
    # reset_statements_db()
    # reset_actions_db()

    # get latest record
    db_timerange = get_db_time_range()
    oldest = db_timerange[0]
    newest = db_timerange[1]
    print "Last record in the DB from '%s' to  '%s'"%(oldest, newest)
    print "Getting more results from the API..."

    # if oldest and newest and oldest < start and end > newest :
    #     print "Statements in the DB are already newer."
    # else :
        # get all statements from xAPI into mongo
    while has_more_records:
        resp = get_records_from_xapi(start, end, offset=offset)
        saved_results = save_statements_to_mongos(resp["statements"])
        logger.debug("New records saved : %s"%saved_results)
        offset = offset + 100
        if resp["more"] == "" :
            print "no more records."
            has_more_records = False

    #find latest action
    actions = extract_networks_from_statements()
    if actions : save_actions_to_mongos(actions)


def parse_args():
    # parse command line arguments
    p = argparse.ArgumentParser()
    p.add_argument('--start', '-s', default=None, help='Crawling start time - format ')
    p.add_argument('--duration', '-d', default=None, help='Duration until crawl final timestamp (number of days)')
    p.add_argument('--verbose', '-v', default=None, help='Set logger to show everything')

    return p

def main():

    # parse cli
    parser = parse_args()
    args = parser.parse_args()

    if not args.duration :
        duration = datetime.timedelta(days=1)
    else :
        duration = datetime.timedelta(days=int(args.duration))

    if args.start :
        start = datetime.datetime.strptime(args.start, '%Y-%m-%d %H:%M:%S.%f')
        end = start + duration
    else :
        end = datetime.datetime.now()
        start = end - duration

    if args.verbose:
        # logging.basicConfig(filename='example.log',level=logging.DEBUG)
        logger.setLevel(logging.DEBUG)



    print "Process data from '%s' to '%s' (%s days)"%(start, end, duration.days)
    # start crawling
    crawl_and_save_records(start, end)

if __name__ == '__main__':
    main()
