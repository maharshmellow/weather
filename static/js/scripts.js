var formdata = new FormData();
formdata.append("id", 5946768);

$.ajax({
    type: 'POST',
    url: '/getWeather/',
    data: formdata,
    contentType: false,
    processData: false,
    success: function(data) {
        var response = JSON.parse(data);
        console.log(response);
        updateData(response);
    },
});


function getCitiesHelper(input, citiesList){
    // go through the citiesList and return all that match
    console.log("Searching...")

    var count = 0;

    var result = $.parseJSON(citiesList);
    var suggestions = [];
    $.each(result, function(k, v) {
        if (k.toLowerCase().indexOf(input.toLowerCase()) != -1){

            if (count > 20){
                return;
            }

            suggestions.push({"value":k, "data":v});
            count += 1;
        }
    });

    return suggestions;
}


$('#cityInput').autocomplete({
    lookup: function (query, done) {
        var input = $("#cityInput").val();

        if (input == ""){
            return;
        }

        var letter = input[0].toLowerCase()

        if (localStorage.getItem(letter) == null){
            // load the file from the server for autocomplete and store in localstorage
            console.log("Loading From Server");

            var formdata = new FormData();
            formdata.append("letter", letter);

            $.ajax({
                type: 'POST',
                url: '/getCities/',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(data) {
                    var response = JSON.parse(data);
                    console.log(response);
                    localStorage.setItem(letter, JSON.stringify(response));

                    var result = {
                        suggestions: getCitiesHelper(input, JSON.stringify(response))
                    };
                    done(result);
                    // return();
                },
            });

        }else{
            console.log("Loading From Local Storage");
            var result = {
                suggestions: getCitiesHelper(input, localStorage.getItem(letter))
            };
            done(result);
        }


    },
    onSelect: function (suggestion) {
        var formdata = new FormData();
        formdata.append("id", suggestion.data);

        $.ajax({
            type: 'POST',
            url: '/getWeather/',
            data: formdata,
            contentType: false,
            processData: false,
            success: function(data) {
                var response = JSON.parse(data);
                console.log(response);
                updateData(response);
            },
        });

        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
    }
});


function updateData(response){
    document.getElementById("weather").textContent = response["temp"].toString() + " °C";
    document.getElementById("description").textContent = capitalizeFirstLetter(response["description"]);
    document.getElementById("minTemp").textContent = response["minTemp"].toString() + "°C";
    document.getElementById("maxTemp").textContent = response["maxTemp"].toString() + "°C";
    document.getElementById("windSpeed").textContent = response["windSpeed"].toString() + " m/s";
    document.getElementById("windDirection").textContent = response["windDirection"].toString() + "°";
    document.getElementById("humidity").textContent = response["humidity"].toString() + " %";
    document.getElementById("pressure").textContent = response["pressure"].toString() + " hPa";
    document.getElementById("sunrise").textContent = formatTime(response["sunrise"]) + " UTC";
    document.getElementById("sunset").textContent = formatTime(response["sunset"]) + " UTC";
    document.getElementById("longitude").textContent = response["longitude"];
    document.getElementById("latitude").textContent = response["latitude"];
    document.getElementById("weatherIcon").className = "owf owf-5x owf-" + response["code"];
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatTime(unixTimestamp){
    var date = new Date(unixTimestamp*1000);
    date.setTime(date.getTime() + date.getTimezoneOffset()*60*1000);

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}
