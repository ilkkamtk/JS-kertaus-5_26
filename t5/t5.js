const apiURL = 'https://media1.edu.metropolia.fi/restaurant/api/v1';

const menuDialog = document.querySelector('#menu');

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let restaurants = [];

function distance(restaurantLocation, myLocation) {
  return Math.sqrt(
    (restaurantLocation[0] - myLocation[0]) ** 2 +
      (restaurantLocation[1] - myLocation[1]) ** 2
  );
}

async function getRestaurants() {
  const response = await fetch(apiURL + '/restaurants');
  restaurants = await response.json();
  renderRestaurants();
}

function renderRestaurants() {
  const target = document.querySelector('table');

  for (const restaurant of restaurants) {
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    nameTd.innerText = restaurant.name;

    const addressTd = document.createElement('td');
    addressTd.innerText = restaurant.address;

    const companyTd = document.createElement('td');
    companyTd.innerText = restaurant.company;

    const cityTd = document.createElement('td');
    cityTd.innerText = restaurant.city;

    tr.append(nameTd, addressTd, companyTd, cityTd);

    // klikkieventti, näytä ravintolan tiedot dialogissa
    tr.addEventListener('click', function () {
      for (const rivi of document.querySelectorAll('tr')) {
        rivi.classList.remove('highlight');
      }

      tr.classList.add('highlight');

      menuDialog.innerHTML = '';
      menuDialog.showModal();
      const modalHTMl = `
        <div>
          <h3>${restaurant.name}</h3>
          <p>${restaurant.phone}</p>
        </div>
      `;
      menuDialog.insertAdjacentHTML('beforeend', modalHTMl);
    });

    target.append(tr);
  }
}

// A function that is called when location information is retrieved
function success(pos) {
  const crd = pos.coords;

  // Printing location information to the console
  console.log(crd);

  restaurants.sort(function (a, b) {
    const etaisyysA = distance(a.location.coordinates, [
      crd.longitude,
      crd.latitude,
    ]);

    const etaisyysB = distance(b.location.coordinates, [
      crd.longitude,
      crd.latitude,
    ]);

    return etaisyysA - etaisyysB;
  });
}

// Function to be called if an error occurs while retrieving location information
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

getRestaurants();
