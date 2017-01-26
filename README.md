# Meta Education


## Requirements

* Python 2.7
* [Nodejs](https://nodejs.org/en/) > 6
* Mongo > 3

## Config

Copy `config/config.sample.js` to `config/config.js` and edit passord/username credentials

Prepare a virtualenv (from 'home')
- Install virtualenv with pip `sudo pip install virtualenv`
- Create your virtual environment  `virtualenv venv` (venv is the name)
- Activate your virtual environment `source venv/bin/activate`

## Run XAPI crawler and parser (from your local meta-education repository)

```bash

  python setup.py install # install the crawler with dependencies

  xapi-client # crawl last day
  xapi-client -d 30 -s '2016-12-10 16:45:00.12'  # crawl last 30 days starting from Oct 12, 4:45pm

```

Read the crawler help with


```bash

usage: xapi-client [-h] [--start START] [--duration DURATION] [--debug]
                   [--recrawl] [--offset OFFSET]

optional arguments:
  -h, --help            show this help message and exit
  --start START, -s START
                        Crawling start time - format : 2016-12-10 16:45:00.12
  --duration DURATION, -d DURATION
                        Duration until crawl final timestamp (number of days)
  --debug, -v           Activate the Debug mode and show all logs
  --recrawl, -r         Recrawl all data for the time period
  --offset OFFSET, -o OFFSET
                        Start crawling from this offset

```

## Collect valid IDs from the database

```bash
python data/find_names.py
```

## Run the viz server app

See in [app](/app) folder for more info

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

### Data Crawler

To get the latest data on the sever
 
- Activate Python virtual environment (using [virtualenv](https://virtualenv.pypa.io/en/stable/)) : `. venv/bin/activate`
- Go in the code folder `cd meta-education`
- Install the Python lib `python setup.py install`
- Launch the crawler `xapi-client -v`

### Web App

Update and restart the web server

- Check the current UID (process ID) with `forever list`
- Stop the current web server using `killall node`
- Check if processes are all down using `ps aux | grep node`
- Launch the script `./update.sh` - it will update the code and start a new server (see below)
- The launch of the app takes approx 1min (time to rebuild JS assets)

```
# update.sh
cd meta-education
git pull origin master
cd app
npm install
pwd
forever start -c "npm start" .
```

