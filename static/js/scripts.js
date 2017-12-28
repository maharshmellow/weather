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
    },
});

function getWeather(input){
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

                getWeatherHelper(input, JSON.stringify(response));
            },
        });

    }else{
        console.log("Loading From Local Storage");
        getWeatherHelper(input, localStorage.getItem(letter));
    }
}

function getWeatherHelper(input, citiesList){
    // go through the citiesList and return all that match
    console.log("Searching...")

    var result = $.parseJSON(citiesList);
    $.each(result, function(k, v) {
        if (k.toLowerCase().indexOf(input.toLowerCase()) != -1){
            console.log(k, v);
        }
    });

}