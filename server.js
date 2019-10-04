const express = require('express');

const server = express();
const projectRouter = require('./routers/projectRouter');


//custom logger Middleware
function logger(req, res, next) {
    console.log((`${req.method} to ${req.url} at ${Date.now()}`));
    next();
};

server.use(logger);
server.use(express.json());
server.use('/api/', projectRouter);


server.get('/', (req, res) => {
    res.send(`<h2>WebApi Sprint!</h2`)
});
module.exports = server;