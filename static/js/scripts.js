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

function getCities(){
    var input = $("#addressBarField").val();

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

                return(getCitiesHelper(input, JSON.stringify(response)));
            },
        });

    }else{
        console.log("Loading From Local Storage");
        return(getCitiesHelper(input, localStorage.getItem(letter)));
    }
}

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
        // Do Ajax call or lookup locally, when done,
        // call the callback and pass your results:
        // var result = {
        //     suggestions: getCities()
        // };

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
        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
    }
});