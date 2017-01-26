# Meta Education Web App


This app contains :

-  `[src/routes](src/routes)` : a JSON API server using express.js and ES6
-  `[src/client](src/client)` : a single page app with React/Redux
-  `[scripts](package.json)` : build for production

API Docs are available at [sical.github.io/meta-education](https://sical.github.io/meta-education/).

### Install

    npm install

### Start app in development mode

    npm run dev-server
    npm run dev-client

### Deploy in production

    npm run prod

In staging mode (port 4000)

    npm run staging

### Build the docs

API Docs are built using the [apidoc](http://apidocjs.com/) lib.  
Use `npm run doc` to to build the API docs. They will be accessible in the `./doc` folder.  

Docs are available at [https://sical.github.io/meta-education/](https://sical.github.io/meta-education/)

You can deploy the doc (on the gh-pages branch) using

    npm run doc-init  # for the first run only
    npm run doc-deploy
