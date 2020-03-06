fetch('/getConfirmedInfo')
    .then(result => {
        return result.json()
    })
    .then(result => {
        let nameDiv = document.getElementById('name')
        nameDiv.innerText = result.givenName + ' ' + result.surname
        let flightDiv = document.getElementById('flight')
        flightDiv.innerText = result.flighNumb
        let seatDiv = document.getElementById('seat')
        seatDiv.innerText = result.seatNumb
        let emailDiv = document.getElementById('email')
        emailDiv.innerText = result.emailConf
    })