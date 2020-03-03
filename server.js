'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating')
const { reservations } = require('./test-data/reservations')
let getFlights = [];

const handleConfirmSeat = (req, res) => {
    res.render('/seat-select', {
        flights: flights,
        reservations: reservations
    })
}

const getData = (req, res) => {
    console.log('We are in getData');
    console.log(req.body);
}
const getFlightNumbers = (req, res) => {
    const flightNumbers = Object.getOwnPropertyNames(flights)
    res.send({ flightNumbers: flightNumbers })
}

const PORT = process.env.PORT || 8000;

express()
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: false }))

    // endpoints
    .post('/seat-select', handleConfirmSeat)

    .post('/validateFlight', (req, res) => {
        console.log(req.body);
        let flightNo = '';
        flightNo = req.body.flightNumber;
        if (flights.hasOwnProperty(flightNo)) {
            console.log('Flight seating', flights[flightNo])
            const flightSeating = flights[flightNo]
            res.send({ status: 'success', flightSeating: flightSeating })
        } else {
            res.send({ status: 'error' })
        }
    })

    .get('/flights', getFlightNumbers)





    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));