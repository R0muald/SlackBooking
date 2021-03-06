'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');

const server = new Hapi.Server();
server.connection({
    port: 3000,
    host: 'localhost'
});

const swagOptions = {
    info: {
            'title': 'Slacktimote API Documentation',
            'version': Pack.version,
    },
    // 'host': 'localhost:3000',
    'host': 'hacktimote.site',
    tags: [
        {
            'name': 'rooms',
            'description': 'Room API calls'
        },
        {
            'name': 'bookings',
            'description': 'Booking API calls'
        },
        {
            'name': 'slack',
            'description': 'Slack API calls'
        }
    ]
    };

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:4321/slacktimote');
mongoose.connect('mongodb://localhost:27017/slacktimote');

const RoomModel = require('./plugins/rooms');
const BookingModel = require('./plugins/bookings');
const SlackRoutes = require('./plugins/slack');

server.route({
    method: 'GET',
    path: '/',
    handler: (req, reply) => {
        reply('Slack Booking');
    }
})

server.register([
    Inert,
    Vision,
    {
        register: require('hapi-swagger'),
        options: swagOptions
    },
    { register: RoomModel },
    { register: BookingModel },
    { register: SlackRoutes },
    {
        register: Good,
        options: {
            reporters: [{
                reporter: require('good-console'),
                events: {
                    response: '*',
                    log: '*'
                }

            }]
        }
    }
], (err) => {

    if(err) {
        console.log(err);
    }
    server.start((err) => {
        if(err) {
            console.log(err);
        }
        server.log('Server running at: ', server.info.uri);
    });
});
