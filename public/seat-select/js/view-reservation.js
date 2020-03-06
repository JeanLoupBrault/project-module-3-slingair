let contentDiv = document.getElementById('content')

// get email from url////////////
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
/////////////////////////////////

console.log('***********************************************************')
const fetchURL = '/get-reservation/' + urlParams.get('email');

fetch(fetchURL)
    .then(result => {
        console.log(result)
        return result.json()
    })
    .then(searchInfo => {
        console.log('searchInfo: ')
        console.log(searchInfo)
        console.log(' type: ')
        console.log(typeof searchInfo.reservations)

        for (reservation in searchInfo.reservations) {

            reservation = searchInfo.reservations[reservation]
            console.log(reservation)
            let reservationInfoUl = document.createElement('ul')
            reservationInfoUl.setAttribute('ìd', 'user-info')

            let nameLi = document.createElement('li')
            let nameSpan = document.createElement('span')
            nameSpan.innerText = reservation.givenName
            nameLi.appendChild(nameSpan);
            reservationInfoUl.appendChild(nameLi);

            let emailLi = document.createElement('li')
            let emailSpan = document.createElement('span')
            emailSpan.innerText = reservation.emailConf
            emailLi.appendChild(emailSpan);
            reservationInfoUl.appendChild(emailLi);

            let flighNumbLi = document.createElement('li')
            let flighNumbSpan = document.createElement('span')
            flighNumbSpan.innerText = reservation.flighNumb
            flighNumbLi.appendChild(flighNumbSpan);
            reservationInfoUl.appendChild(flighNumbLi);

            let seatLi = document.createElement('li')
            let seatSpan = document.createElement('span')
            seatSpan.innerText = reservation.seatNumb
            seatLi.appendChild(seatSpan);
            reservationInfoUl.appendChild(seatLi);

            contentDiv.appendChild(reservationInfoUl);
        }

    })