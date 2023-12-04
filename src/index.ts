import { createServer } from 'http';
import { app } from './app.js';
import { dbConnect } from './services/db.connect.js';
import createDebug from 'debug';

const PORT = process.env.PORT || 3030;

const server = createServer(app);
const debug = createDebug('W9E:index');

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit(error));

server.on('listening', () => {
  console.log('Listening on port', PORT);
});

server.on('error', (error) => {
  console.log(`Error ${error.message}`);
});
