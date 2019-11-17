
$(document).ready(function () {
    
    // FUNCTIONS

    function show(data) {

        // Used UTF-8 Letterlike Symbol for DEGREE FAHRENHEIT
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
    <p><strong>Temperature</strong>: ${data.main.temp} &#8457</p> 
    <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
    <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
    <p><strong>UV Index</strong>:${data.coord.lat, data.coord.lon}</p>
    `
    }

    function displayCities(cityList) {
        $('.city-list').empty();
        var list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        // returning as a string, find javascript function to parse cityList
        if (list) {
            for (var i = 0; i < cityList.length; i++) {
                var container = $("<div class=card></div>").text(cityList[i]);
                $('.city-list').prepend(container);
            }
        }
    }

    function showForecast(data) {
        var forecast = data.list;
        // test for connection
        console.log("DATALIST", data.list);
       
        var currentForecast = [];
        for (var i = 0; i < forecast.length; i++) {

            var currentObject = forecast[i];

            var dt_time = currentObject.dt_txt.split(' ')[1] // '12:00:00'[1 is the number of index]
            // At each index..If...dt_txt === "12:00:00" get info
            if (dt_time === "12:00:00") {
                // currentObject.main ... time, icon, temp, humidity
                var main = currentObject.main;
                // Store each of these in variables
                var temp = main.temp; // TODO: Convert to F
                var humidity = main.humidity;
                var date = moment(currentObject.dt_txt).format('l'); // TODO: Use MomentJS to convert
                var icon = currentObject.weather[0].icon;
                // looking for Icon
                console.log('ICON',currentObject.weather[0].icon);
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} &#8457</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }

        }
        $("#5-day-forecast").html(currentForecast.join(''));

    }
 

    // METHODS

    var stored = localStorage.getItem("cityList")
    if (stored) {
        cityList = JSON.parse(stored);
    } else {
        cityList = [];
    }
    //var cityList = [];
    $('#submitCity').click(function (event) {
        // test submit button
        console.log("submited");
        event.preventDefault();
        var city = $('#city').val();
        var lat = 0;
        var lon = 0;
        // push city to cityList array
        cityList.push(city);
        // set cityList in localStorage (remember to use stringify!)
        localStorage.setItem("cityList", JSON.stringify(cityList));
        displayCities(cityList);
        if (city != '') {
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=73192c342d8281ba63628333be8a6075",
                type: "GET",
                success: function (data) {
                    console.log("WEATHER", data);
                    var display = show(data);
                    $("#show").html(display);
                }
              
            });    


            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=73192c342d8281ba63628333be8a6075",
                type: "GET",
                success: function (data) {
                    showForecast(data);
                }
            });

            //  Couldn't get this one to work kept telling me unauthorized, Created different API  key as well.

            $.ajax({
                url:'https://api.openweathermap.org/data/2.5/uvi?appid=' + "&APPID=27b53b501bc452b1f0dc8302c5961c43" + "&lat=" + lat + "&lon=" + lon,
                type: "GET",
                sucess: function (uvDisplay) {
                   console.log("uvDisplay",uvDisplay);
                   showUV(data.coord.lat, data.coord.lon);
                   console.log("COORD",data.coord.lat, data.coord.lon);
               
                 }
            });

        } else {
            $('#error').html('Please insert a city name:');
        }
    });

    displayCities(cityList);

});



// $.ajax({
//     url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=73192c342d8281ba63628333be8a6075",
//     type: "GET",
//     success: function (data) {
//         showForecast(data);
//         // add to page
//     }
// });