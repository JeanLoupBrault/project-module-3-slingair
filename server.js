'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating')
const { reservations } = require('./test-data/reservations')
let confirmedInfo;
let confirmedInfoView = {};
let confirmedUserId = {};

const handleConfirmSeat = (req, res) => {
    res.render('/seat-select', {
        flights: flights,
        reservations: reservations
    })
}

// const getData = (req, res) => {
//     console.log('We are in getData');
//     console.log(req.body);
// }

const getFlightNumbers = (req, res) => {
    const flightNumbers = Object.getOwnPropertyNames(flights)
    res.send({ flightNumbers: flightNumbers })
}

const handleConfirmedRes = (req, res) => {
    console.log('req body: ', req.body)
    let objConfirmedInfo = {};

    objConfirmedInfo.givenName = req.body.givName
    objConfirmedInfo.surname = req.body.surName
    objConfirmedInfo.flighNumb = req.body.flightNo
    objConfirmedInfo.emailConf = req.body.eMail
    objConfirmedInfo.seatNumb = req.body.seatNo
    objConfirmedInfo.id = String(Math.floor(Math.random() * 1000000000000000000));
    console.log('objconfirmedInfo: ', objConfirmedInfo)
    confirmedInfo = objConfirmedInfo
    console.log('confirmedInfo: ', confirmedInfo)
    try {
        reservations.push(objConfirmedInfo);
        console.log('Reservation added to list: ')
        console.log('reservation after new one added to the list: ', reservations)
    }
    catch (err) { console.log(err); throw new Error(err) }
    res.send({ status: 'success' })
}

const handleConfirmedInfo = (req, res) => {
    res.send(confirmedInfo)
}

const handleViewRes = (req, res) => {
    let searchedEmail = req.params.email

    // Find all reservations with searchedEmail
    let searchUserReservations = reservations.filter(reservation => reservation.emailConf === searchedEmail);

    let searchInfo = {
        email: searchedEmail,
        reservations: searchUserReservations
    }
    console.log('searchInfo: ', searchInfo)
    res.send(searchInfo)
}

const handleSendToView = (req, res) => {
    let searchedEmail = req.params.email
    console.log('searchedEmail: ', searchedEmail)
    res.redirect('/seat-select/view-reservation.html?email=' + searchedEmail)
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
    .get('/getConfirmedInfo', handleConfirmedInfo)
    .post('/confirmed', handleConfirmedRes)
    .get('/get-reservation/:email', handleViewRes)
    .get('/view-reservation/:email', handleSendToView)


    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));