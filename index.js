const http = require('http');
const app = require('./app');
const server = http.createServer(app);
// eslint-disable-next-line no-undef
const port = process.env.PORT || 4000;
// eslint-disable-next-line no-undef
global.appRoot = __dirname;
server.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}`));
