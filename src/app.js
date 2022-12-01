const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// MODULARIZAR RUTAS

const authUser = require('./routes/user.routes.js');
const authArtist = require('./routes/artist.routes.js');
const event = require('./routes/event.routes.js');
const place = require('./routes/place.routes.js');
const genres = require('./routes/genres.routes.js');
const payment = require('./routes/mercadoPago.routes');
const team = require('./routes/team.routes');
const search = require('./routes/search.routes');
require('./db');

const server = express();
const cors = require('cors');

server.name = 'API';
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
    );
    next();
});

server.use('/auth', authUser);
server.use('/auth', authArtist);
server.use('/event', event);
server.use('/place', place);
server.use('/genres', genres);
server.use('/payment', payment);
server.use('/team', team);
server.use('/get', search);

// Error catching endware.
server.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});

module.exports = server;
