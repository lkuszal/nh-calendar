function getSeatList() {
    var seatArray = [...document.querySelectorAll('.seat.chosen')].map(x => [x.getAttribute('rzad'), x.getAttribute('miejsce')])
    const rows = {};
    seatArray.forEach(([row, seat]) => {
      if (!rows[row]) {
        rows[row] = [];
      }
      rows[row].push(seat);
    });

    return Object.entries(rows)
      .map(([row, seats]) => `Rząd ${row} - ${seats.length > 1 ? 'Miejsca' : 'Miejsce'} ${seats.join(', ')}`)
      .join('\n');
}

function parseTime(startTimeRaw, duration) {
    var splitTime = startTimeRaw.split("-");
    startTime = new Date([splitTime[1], splitTime[0], splitTime[2]].join('-'));
    const adsDuration = 15;
    endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + parseInt(duration) + adsDuration);
    return startTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') + '/' + endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function redirectToCalendar() {
    var dataObject = eval(/[(].*item_variant.*[)]/gm.exec([...document.querySelectorAll('script[data-category="marketing"]')].filter(x => x.innerText.includes('item_variant'))[0].innerText)[0]).ecommerce.items[0];
    var movieName = dataObject.item_category2;
    var startTimeRaw = dataObject.item_variant;
    var duration = document.querySelector('.czolw').innerText.split(',').slice(-1)[0].replace(/\D/g, '');
    var room = document.querySelector('.datasala').innerText.split(',').slice(-1)[0].split(' ').slice(-1)[0];
    var eventTime = parseTime(startTimeRaw, duration);
    var formattedSeats = getSeatList();
    var eventName = encodeURIComponent(`NH: ${movieName} sala ${room}`);
    var eventDescription = encodeURIComponent(`${formattedSeats}`);
    var calendarLink = `https:\/\/calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}&details=${eventDescription}&dates=${eventTime}`;
    window.open(calendarLink, '_blank');
}

function addCalendarButton() {
    var buttonHTML = `<div id="addToCalendar" class="przycisk" style="display: flex;" onclick="redirectToCalendar()">
        Dodaj do kalendarza
        <!--?xml version="1.0" encoding="utf-8"?--><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
            <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 1em;">
                <path d="M18 16L16 16M16 16L14 16M16 16L16 14M16 16L16 18" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M7 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
        </div>`;
    document.querySelector('#submitKupBilety').insertAdjacentHTML('beforebegin', buttonHTML);
}

window.addEventListener('load', addCalendarButton);
