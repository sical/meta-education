# Meta Education


## Requirements

* Python 2.7
* [Nodejs](https://nodejs.org/en/) > 6
* Mongo > 3

## Config

Copy `config/config.sample.js` to `config/config.js` and edit passord/username credentials

## Run XAPI crawler and parser

```bash

  python setup.py install # install the crawler with dependencies

  xapi-client # crawl last day
  xapi-client -d 30 -s '2016-12-10 16:45:00.12'  # crawl last 30 days starting from Oct 12, 4:45pm

```

Read the crawler help with


```bash

  xapi-client --help

  usage: xapi-client [-h] [--start START] [--duration DURATION]
                   [--verbose VERBOSE] [--recrawl RECRAWL] [--offset OFFSET]

  optional arguments:
    -h, --help            show this help message and exit
    --start START, -s START
                          Crawling start time - format
    --duration DURATION, -d DURATION
                          Duration until crawl final timestamp (number of days)
    --verbose VERBOSE, -v VERBOSE
                          Set logger to show everything
    --recrawl RECRAWL, -r RECRAWL
                          Recrawl all data for the time period
    --offset OFFSET, -o OFFSET
                          Start crawling from this offset



```

## Collect valid IDs from the database

```bash
python data/find_names.py
```

## Run the viz server app

```
cd app
npm install
npm run dev-client
npm run dev-server
```

run on [http://localhost:3000](http://localhost:3000)

#### Run in production

```
npm start
```

## Release a new version

```
npm run publish
```

## Deploy on the prod server

Update and restart the web server

- Check the current UID (process ID) with `forever list`
- Stop the current web server using `forever stop $UID` (ex. `forever stop JeoO`)
- Launch the script `./update.sh` - it will update the code and start a new server (see below)

```
# update.sh
cd meta-education
git pull origin master
cd app
npm install
pwd
forever start -c "npm start" .
```
