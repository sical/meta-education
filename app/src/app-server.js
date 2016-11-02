// Importing node modules
import express from 'express';
import hogan from 'hogan-express'

// Importing source files
import api from './routes/api.routes';
import home from './routes/home.routes';

// consts
const app = express();

// config
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/public/'))
app.set('port', (process.env.PORT || 3000))


// API routes
app.use('/api', api);
app.use('/', home);


// serve files
app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))
