package main

import (
	"fmt"
	owm "github.com/briandowns/openweathermap"
	"os"
	"encoding/json"
	"net/http"
	"strconv"
	"io/ioutil"
)

type Weather struct{
	//city string
	Id int `json:"id"`
	Longitude float64 `json:"longitude"`
	Latitude float64 `json:"latitude"`
	Temp float64 `json:"temp"`
	MinTemp float64 `json:"minTemp"`
	MaxTemp float64 `json:"maxTemp"`
	Description string `json:"description"`
	WindSpeed float64 `json:"windSpeed"`
	WindDirection float64 `json:"windDirection"`
	Humidity int `json:"humidity"`
	Pressure float64 `json:"pressure"`
	Sunrise int `json:"sunrise"`
	Sunset int `json:"sunset"`
	Time int `json:"time"`
}

// gets the weather for a city by id
func getWeather(writer http.ResponseWriter, request *http.Request){

	// TODO add error checking here

	cityId, err := strconv.ParseInt(request.FormValue("id"), 0, 64)

	if err != nil{
		fmt.Fprintln(writer, "Error")
		return
	}

	w, err := owm.NewCurrent("C", "en", os.Getenv("OWM_API_KEY")) // fahrenheit (imperial) with Russian output
	if err != nil {
		fmt.Fprintln(writer, "Error")
		return
	}
	fmt.Println(cityId)
	w.CurrentByID(int(cityId))

	weather := Weather{int(cityId), w.GeoPos.Longitude, w.GeoPos.Latitude, w.Main.Temp,
	w.Main.TempMin, w.Main.TempMax, w.Weather[0].Description, w.Wind.Speed, w.Wind.Deg,
	w.Main.Humidity, w.Main.Pressure, w.Sys.Sunrise, w.Sys.Sunset, w.Dt}

	weatherMarshalled, _ := json.Marshal(weather)

	fmt.Fprint(writer, string(weatherMarshalled))

}

// used to get the initial list of all cities for autocomplete
func getCities(writer http.ResponseWriter, request *http.Request){
	dat, err := ioutil.ReadFile("cities.json")

	if err != nil{
		fmt.Fprintln(writer, "Error")
		return
	}

	fmt.Fprintf(writer, string(dat))
}

func main() {
	os.Setenv("OWM_API_KEY", "cde3fd92c6a3989c1f6c2b70f2d6a448")

	http.HandleFunc("/", getWeather)
	http.HandleFunc("/cities/", getCities)
	http.ListenAndServe(":8000", nil)

}
