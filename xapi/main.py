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
logging.basicConfig(
                            filename=logname,
                            filemode='a',
                            format='%(asctime)s,%(msecs)d %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.DEBUG)

logger = logging.getLogger()

# timeframe to fetch and process data
# start = datetime(2016, 10, 18, 11, 50, 0)
# end = datetime(2016, 10, 18, 22, 5, 0)

def crawl_and_save_records(start, end, offset=0):
    print "Getting more results from the API starting at %s..."%start

    # init for crawler
    has_more_records = True

    limit=100 # number of records for each fetch
    while has_more_records:
        logger.debug("Getting %s records"%limit)
        try :
            resp = get_records_from_xapi(start, end, offset=offset,limit=limit)
        except ValueError, e:
            if "API Error 500 : Allowed memory size" in str(e): # returned API files are too big
                limit= 50 # try only 50 records
                # resp = get_records_from_xapi(start, end, offset=offset, limit=limit)


        saved_results = save_statements_to_mongos(resp["statements"])
        logger.debug("New records saved : %s"%saved_results)
        offset = offset + limit
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
    p.add_argument('--debug',
        '-v',
        default=False,
        action='store_true',
        help='Activate the Debug mode and show all logs')

    p.add_argument('--recrawl',
        '-r',
        default=False,
        action='store_true',
        help='Recrawl all data for the time period')

    p.add_argument('--offset', '-o', default=None, help='Start crawling from this offset')

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

    if args.debug:
        # logging.basicConfig(filename='example.log',level=logging.DEBUG)
        logger.setLevel(logging.DEBUG)

    db_timerange = get_db_time_range()
    oldest = db_timerange[0]
    newest = db_timerange[1]
    print "Record in the DB from '%s' to  '%s'"%(oldest, newest)

    # get from latest record
    if not args.recrawl:
        start = newest

    print "Process data from '%s' to '%s' (%s days)"%(start, end, duration.days)

    # start crawling
    if args.offset and int(args.offset):
        crawl_and_save_records(start, end, offset=int(args.offset))
    else:
        crawl_and_save_records(start, end)

if __name__ == '__main__':
    main()
