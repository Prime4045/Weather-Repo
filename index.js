import { weatherApiUrl, apiKey } from "./api.js"

const weatherBox = document.querySelector('#weather-box');
const errorMessage = document.querySelector('#error-message');

async function getLocation(position) {
    let result;
    if (position.coords) {
        // If location has coordinates, use them to fetch weather
        result = await getWeather(position.coords.latitude, position.coords.longitude);
    } else {
        // Otherwise, use the city name to fetch weather
        result = await getCityWeather(position);
    }

    // Check if the API returned a valid result
    if (result && result.location && position !== result.location.name) {
        displayData(result);
    } else {
        displayError();
    }
}

function displayData(result) {
    const cityName = document.querySelector('.city_name');
    const windSpeed = document.querySelector('.wind');
    const Temp = document.querySelector('.temp');
    const feelTemp = document.querySelector('.fellTemp');
    const Humidity = document.querySelector('.humid');
    const weather = document.querySelector('.weather');
    const icon = document.querySelector('#icon');

    weatherBox.style.display = 'flex';
    errorMessage.style.display = 'none';

    cityName.innerHTML = result.location.name + ', ' + result.location.region;
    Temp.innerHTML = result.current.temp_c + ' °C';
    feelTemp.innerHTML = result.current.feelslike_c + ' °C';
    windSpeed.innerHTML = result.current.wind_kph + ' Km/h';
    weather.innerHTML = result.current.condition.text;
    Humidity.innerHTML = result.current.humidity + ' %';

    // Clear previous icon and set new one
    icon.innerHTML = '';
    let img = document.createElement('img');
    img.src = result.current.condition.icon;
    icon.appendChild(img);
}

function displayError() {
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = "Couldn't find weather";
    weatherBox.style.display = 'none';
}

function failedToGet() {
    console.log("Failed to get location");
}

window.addEventListener('load', function () {
    navigator.geolocation.getCurrentPosition(getLocation, failedToGet);
});

async function getWeather(lat, lon) {
    const response = await fetch(weatherApiUrl + apiKey + `&q=${lat},${lon}` + `&aqi=yes`);
    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

async function getCityWeather(location) {
    const response = await fetch(weatherApiUrl + apiKey + `&q=${location}` + `&aqi=yes`);
    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

const inputBox = document.querySelector('#input-box');
const SearchBtn = document.querySelector('#search-btn');

SearchBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const value = inputBox.value.trim();
    if (value === "") {
        const enterLocation = document.querySelector('#enterLocation');
        enterLocation.style.display = 'block';
        weatherBox.style.display = 'none';
    } else {
        document.getElementById('enterLocation').style.display = 'none';
        await getLocation(value);
    }
});

inputBox.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = inputBox.value.trim();
        if (value === "") {
            const enterLocation = document.querySelector('#enterLocation');
            enterLocation.style.display = 'block';
            weatherBox.style.display = 'none';
        } else {
            document.getElementById('enterLocation').style.display = 'none';
            await getLocation(value);
        }
    }
});
