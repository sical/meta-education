# Meta Education


## Config

Copy `config/config.sample.js` to `config/config.js` and edit passord/username credentials

## Run XAPI crawler and parser

```bash

  python setup.py # install the crawler with dependencies

  xapi-client # crawl last day
  xapi-client -d 30 -s '2016-12-10 16:45:00.12'  # crawl last 30 days starting from Oct 12, 4:45pm

```

## Run the VIZ app

Require [Nodejs](https://nodejs.org/en/) > 6

install dependencies:

  $ cd app && npm install

run the app on [http://localhost:3000](http://localhost:3000)

  $ npm run dev

run in production

  $ npm start


## Refs

Fonts

* https://discover.typography.com/theme/redline/
* https://www.quora.com/What-are-some-of-your-favorite-fonts-for-dashboards
* Font scale : http://typecast.com/blog/a-more-modern-scale-for-web-typography
* Font Scale : http://type-scale.com/?size=16&scale=1.333&text=A%20Visual%20Type%20Scale&webfont=Lato&font-family=Lato,%20sans&font-weight=300&font-family-headers=&font-weight-headers=inherit&background-color=white&font-color=#333

Colors

* Flat UI https://flatuicolors.com
