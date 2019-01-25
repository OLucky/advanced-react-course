require('dotenv').config({path: './variables.env'});
const cookieParcer = require('cookie-parser');

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParcer());

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, deets => {
  console.log(`Server is now running on port http://localhost:${deets.port}`);
})