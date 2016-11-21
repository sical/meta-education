# Meta Education


## Config

Copy `config/config.sample.js` to `config/config.js` and edit passord/username credentials

## Requirements 

* Python 2.7
* [Nodejs](https://nodejs.org/en/) > 6 
* Mongo > 3

## Run XAPI crawler and parser

```bash

  python setup.py install # install the crawler with dependencies

  xapi-client # crawl last day
  xapi-client -d 30 -s '2016-12-10 16:45:00.12'  # crawl last 30 days starting from Oct 12, 4:45pm
  
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
