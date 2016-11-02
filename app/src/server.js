// Importing node modules
import express from 'express';

// Importing source files
import routes from './routes/main.routes';
import api from './routes/api.routes';

// consts
const app = express();

app.use('/', routes);
app.use('/api', api);

// arrow functions
const server = app.listen(3000, () => {
	// destructuring
  const {address, port} = server.address();

  // string interpolation:
  console.log(`Example app listening at http://${address}:${port}`);
});
