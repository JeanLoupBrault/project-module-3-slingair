const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
let selection = '';
let dropdown = document.getElementById('flightNums');
console.log('Dropdown: ', dropdown)

const renderSeats = (flightNumber, flightSeatingInfo) => {
    document.querySelector('.form-container').style.display = 'block';
    console.log(flightNumber)
    console.log(flightSeatingInfo)

    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s - 1]}`;
            const seat = document.createElement('li');
            let currentSeat = flightSeatingInfo.find(seat => {
                console.log('seatId, seatNumber', seat.id, seatNumber);
                return seat.id === seatNumber
            });
            console.log('currentSeat: ', currentSeat);

            if (currentSeat.isAvailable === true) {
                const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`
                seat.innerHTML = seatAvailable;
                row.appendChild(seat);
            } else {
                const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
                seat.innerHTML = seatOccupied;
                row.appendChild(seat);
            }
        }

        let seatMap = document.forms['seats'].elements['seat'];
        console.log(document.forms)
        seatMap.forEach(seat => {
            seat.onclick = () => {
                selection = seat.value;
                seatMap.forEach(x => {
                    if (x.value !== seat.value) {
                        document.getElementById(x.value).classList.remove('selected');
                    }
                })
                document.getElementById(seat.value).classList.add('selected');
                document.getElementById('seat-number').innerText = `(${selection})`;
                confirmButton.disabled = false;
            }
        });

    }
}

const toggleFormContent = (event) => {
    //console.log(flightNumber);
    const flightNumber = dropdown.options[dropdown.selectedIndex].innerText;
    console.log('toggleFormContent: ', flightNumber);
    const data = { flightNumber: flightNumber };
    fetch('/validateFlight', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
        .then(result => {
            console.log('result before .json', result)
            return result.json()
        })
        .then(result => {
            console.log('result after .json', result)
            if (result.status === 'success') {
                const flightSeatingInfo = result.flightSeating
                renderSeats(flightNumber, flightSeatingInfo);
            } else {
                console.log('Error: ', result.status);
            }
        });
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
    //renderSeats(flightNumber);
}
const handleConfirmSeat = (event) => {
    event.preventDefault()
    console.log('window.location: ', window.location);
    let givName = document.getElementById('givenName').value;
    let surName = document.getElementById('surname').value;
    let eMail = document.getElementById('email').value;
    let flightNo = dropdown.options[dropdown.selectedIndex].innerText; // from dropdown menu
    let seatNo = document.getElementById('seat-number').innerText;

    const data = {
        givName: givName,
        surName: surName,
        eMail: eMail,
        flightNo: flightNo,
        seatNo: seatNo
    }
    console.log('data: ', data)
    fetch('/confirmed', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

        .then(result => {
            return result.json()
        })
        .then(result => {
            console.log('result: ', result)
            if (result.status === 'success') {
                window.location.href = `/seat-select/confirmed.html`
            }
        })
}

const getFlights = () => {
    fetch('/flights', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
        .then(result => {
            console.log('result before .json', result)
            return result.json()
        })
        .then(result => {
            console.log('result after .json', result)
            const { flightNumbers } = result;
            flightNumbers.forEach(flightNumber => {
                let option = document.createElement('option');
                option.value = flightNumber;
                option.innerText = flightNumber;
                option.id = flightNumber;
                console.log(option);
                dropdown.appendChild(option);
            })
            dropdown.addEventListener('change', (event) => toggleFormContent(event))
        });
}
getFlights();
