
//renderCity();

$(document).ready(function () {

  var cities = ["San Francisco", "Sacramento", "Los Angeles", "San Diego", "Redding"];

  $("#clickChoice").on("click", function (e) {
    //for user to do own thing 
    e.preventDefault();

    const cityName = $("#userChoice").val().trim();

    cities.push(cityName);

    console.log(cityName);

    displayWeatherInfo(cityName);

    getForecast(cityName);

    renderButton();
  });


  function displayWeatherInfo(cityName) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=b0ccefda6d3674eada5d69e1041ccc24";

    $("#today").empty();

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      console.log(response);


      //branches you are getting the branches
      const mainName = response.name;
      const mainWind = response.wind.speed;
      const mainHumid = response.main.humidity;
      const mainTemp = response.main.temp;
      const mainImg = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;


      //placing the top branches to the html
      const windCard = $("<p>").addClass("card-text").text(`Wind Speed: ${mainWind} MPH`);
      const humidityCard = $("<p>").addClass("card-text").text(`Humidity: ${mainHumid}`);
      const temperatureCard = $("<p>").addClass("card-text").text(`Temperature: ${Math.round(mainTemp - 273) + "C"}`);
      const imageCard = $("<img>").attr("src", mainImg);


      //make a function to show 5 day box here, probably
      const title = $("<h3>").addClass("card-title").text(`${mainName} (${new Date().toLocaleDateString()})`);
      const card = $("<div>").addClass("card");
      const cardData = $("<div>").addClass("card-body");


      title.append(imageCard);
      cardData.append(title, windCard, humidityCard, temperatureCard);
      card.append(cardData);
      $("#today").append(card);

      const latitude = response.coord.lat;
      const longitude = response.coord.lon;

      console.log(latitude, longitude);

      getUVIndex(latitude, longitude);

    });
  };


  function getUVIndex(lat, lon) {

    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=b0ccefda6d3674eada5d69e1041ccc24&lat=" + lat + "&lon=" + lon
    }).then(function (response) {
      const mainUV = response.value;

      const UVCard = $("<p>").text(`UV Index: `);
      const btnCard = $("<span>").addClass("btn btn-sm").text(mainUV);

      if (mainUV < 3) {
        btnCard.addClass("btn-safe");
      }
      else if (mainUV < 7) {
        btnCard.addClass("btn-warning");
      }
      else {
        btnCard.addClass("btn-danger");
      }

      //append 
      UVCard.append(btnCard);

      $("#today .card-body").append(UVCard);
    })

  };

  function getForecast(cityName) {

    $.ajax({
      type: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=b0ccefda6d3674eada5d69e1041ccc24"
    }).then(function (response) {

      console.log(response);


      $("#forecast").html("<h4> 5-Day Forecast </h4>").append("<div class=\"row\">")

      for (var i = 0; i < response.list.length; i += 8) {

        const column = $("<div>").addClass("col-md-2");

        const card = $("<div>").addClass("card-bg-primary text-black");

        const cardForecast = $("<div>").addClass("card-body p-2");

        const title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());

        const img = $("<img>").attr("src", `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`);

        const temp = $("<p>").addClass("card-text").text(`Temp: ${Math.round(response.list[i].main.temp_max - 273)} ` + "C");

        const humid = $("<p>").addClass("card-text").text(`Humidity: ${response.list[i].main.humidity}`)

        cardForecast.append(title, img, temp, humid);
        card.append(cardForecast);
        column.append(card);

        $("#forecast .row").append(column);
      }
    })
  };

  function renderButton() {

    $(".cities").empty();
    for (let i = 0; i < cities.length; i++) {

      const listItem = $("<li>").addClass("current-city list-group-item list-group-item-action").attr("data-city", cities[i]).text(cities[i]);
      $(".cities").append(listItem);
    }
  };

  $(document).on("click", ".current-city", function () {


    const cityName = ($(this).attr("data-city"));

    displayWeatherInfo(cityName);
  })

  renderButton();


});  
