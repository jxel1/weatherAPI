////fetch

function currentWeather() {
  const apiKey = "188b3c31ec17ea3d3a6babd64aad98e5";
  const city = document.getElementById("city").value;

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastedWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((err) => {
      console.log(err);
    });

  fetch(forecastedWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((err) => {
      console.log(err);
    });

  fetch(forecastedWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayDailyForecast(data.list);
    })
    .catch((err) => {
      console.log(err);
    });
}

//////display

function displayWeather(data) {
  const tempInfo = document.querySelector(".temp");
  const location = document.getElementById("location");
  const typeOfWeather = document.getElementById("type-of-weather");
  const date = document.getElementById("date");
  const wind = document.getElementById("wind");
  const humidity = document.getElementById("humidity");
  const pressure = document.getElementById("pressure");
  const visibility = document.getElementById("visibility");
  const sunset = document.getElementById("sunset");
  const sunrise = document.getElementById("sunrise");
  const feelsLike = document.getElementById("feels-like");

  tempInfo.innerHTML = "";
  location.innerHTML = "";
  typeOfWeather.innerHTML = "";
  date.innerHTML = "";
  wind.innerHTML = "";
  humidity.innerHTML = "";
  pressure.innerHTML = "";
  visibility.innerHTML = "";
  sunset.innerHTML = "";
  sunrise.innerHTML = "";
  feelsLike.innerHTML = "";

  if (data.cod === "404") {
    alert("City not found");
    return;
  } else {
    //
    const city = data.name;
    const temp = Math.round(data.main.temp - 273.15);
    const typeWeather = data.weather[0].main;
    //
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const dateNow = `${day}.${month}.${year}`;
    //
    const windSpeed = data.wind.speed;
    const humidityValue = data.main.humidity;
    const pressureValue = data.main.pressure;
    const visibilityValue = data.visibility / 1000;
    //
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit" }
    );
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit" }
    );
    //
    const feelsLikeValue = Math.round(data.main.feels_like - 273.15);

    // const desc = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const tempHTML = `<h1 class="degree" id="temp-info">${temp}°C</h1>

            <img src="${iconUrl}" alt="Weather Icon" id="weather-icon">`;
    const locationHTML = `${city}`;
    const typeOfWeatherHTML = `${typeWeather}`;
    const dateHTML = `${dateNow}`;
    const windHTML = `${windSpeed}`;
    const humidityHTML = `${humidityValue}`;
    const pressureHTML = `${pressureValue}`;
    const visibilityHTML = `${visibilityValue}`;
    const sunriseHTML = `${sunriseTime}`;
    const sunsetHTML = `${sunsetTime}`;
    const feelsLikeHTML = `${feelsLikeValue}°C`;
    // const iconHTML = `<img src="${iconUrl}" alt="Weather Icon">`;

    tempInfo.innerHTML += tempHTML;
    location.innerHTML += locationHTML;
    typeOfWeather.innerHTML += typeOfWeatherHTML;
    date.innerHTML += dateHTML;
    wind.innerHTML += windHTML;
    humidity.innerHTML += humidityHTML;
    pressure.innerHTML += pressureHTML;
    visibility.innerHTML += visibilityHTML;
    sunrise.innerHTML += sunriseHTML;
    sunset.innerHTML += sunsetHTML;
    feelsLike.innerHTML += feelsLikeHTML;
    // weatherIcon.innerHTML += iconHTML;

    showImage();
  }
}

//hourly

function displayHourlyForecast(hourlyData) {
  const hourlyForecast = document.getElementById("hourly-forecast");
  const today = hourlyData.slice(0, 7);
  hourlyForecast.innerHTML = "";

  today.forEach((item) => {
    const time = new Date(item.dt * 1000);
    const hour = time.getHours();
    const temp = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const forecastHTML = `<li>
                                <p>${hour}:00</p>
                                <img src="${iconUrl}" alt="Weather Icon">
                                <p>${temp}°C</p>
                              </li>`;

    hourlyForecast.innerHTML += forecastHTML;
  });
}

//daily

function displayDailyForecast(data) {
  const dailyInfo = document.getElementById("daily-forecast");
  dailyInfo.innerHTML = "";

  // Filter data to get only one forecast per day (e.g., the forecast at 12:00 PM)
  const dailyData = data
    .filter((entry) => entry.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  dailyData.forEach((dayData) => {
    const date = new Date(dayData.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" }); // Get short form of weekday
    const dayNumber = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    }); // Full month name and numeric day
    const temp = Math.round(dayData.main.temp - 273.15); // Convert Kelvin to Celsius
    const weatherDescription = dayData.weather[0].main;
    const weatherIcon = dayData.weather[0].icon;

    const dailyHTML = `<li class="weather-card">
        <div class="day-info">
        
          <h3>${dayName}</h3>
          <h3 >${dayNumber}</h3>
        </div>
        <div class="temp">
          <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}">
          <h2>${temp}&deg;C</h2>
        </div>
      </li>`;

    dailyInfo.innerHTML += dailyHTML;
  });
}

//images

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}
