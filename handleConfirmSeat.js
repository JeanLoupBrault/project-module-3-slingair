

const reservData = [];
const flightData = [];
const availSeat = false;
let numOfSeats = 60;
let seat = [];

//validate flight
function validFlight(flights) {
    //const flightData = flights[flightId];
    const reservData = reservations.flight.value;

    //validate seat
    if (reservData === 'SA231') {
        if (reservations.seat.value === flights.id) {
            availSeat = flights.isAvailable;

        }
            .then(data => {
            console.log('Data: ', data)
            return availSeat;
        });
        res.status(400).json({ data: seats });

    }

}