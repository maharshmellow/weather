package main

import (
	"fmt"
	owm "github.com/briandowns/openweathermap"
	"os"
	"encoding/json"
	"net/http"
	"strconv"
	"io/ioutil"
	"bytes"
)

type Weather struct{
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
	Code int `json:"code"`
}

// gets the weather for a city by id
func getWeather(writer http.ResponseWriter, request *http.Request){

	cityId, err := strconv.ParseInt(request.FormValue("id"), 0, 64)

	if err != nil{
		fmt.Fprintln(writer, "Error")
		return
	}

	w, err := owm.NewCurrent("C", "en", os.Getenv("OWM_API_KEY"))
	if err != nil {
		fmt.Fprintln(writer, "Error")
		return
	}

	// get the weather by the city id taken from client
	w.CurrentByID(int(cityId))

	weather := Weather{int(cityId), w.GeoPos.Longitude, w.GeoPos.Latitude, w.Main.Temp,
	w.Main.TempMin, w.Main.TempMax, w.Weather[0].Description, w.Wind.Speed, w.Wind.Deg,
	w.Main.Humidity, w.Main.Pressure, w.Sys.Sunrise, w.Sys.Sunset, w.Dt, w.Weather[0].ID}

	weatherMarshalled, _ := json.Marshal(weather)

	fmt.Fprint(writer, string(weatherMarshalled))

}

// used to get the initial list of all cities for autocomplete
func getCities(writer http.ResponseWriter, request *http.Request){

	letter := request.FormValue("letter")

	var buffer bytes.Buffer
	buffer.WriteString("data/")
	buffer.WriteString(letter)
	buffer.WriteString(".json")

	fmt.Println(buffer.String())

	dat, err := ioutil.ReadFile(buffer.String())

	if err != nil{
		fmt.Fprintln(writer, "Error")
		return
	}

	fmt.Fprintf(writer, string(dat))
}

func determineListenAddress() (string, error) {
	port := os.Getenv("PORT")
	if port == "" {
		return "", fmt.Errorf("$PORT not set")
	}
	return ":" + port, nil
}

func main() {
	addr, _ := determineListenAddress()

	index := http.FileServer(http.Dir("static"))
	http.Handle("/", index)

	http.HandleFunc("/getWeather/", getWeather)
	http.HandleFunc("/getCities/", getCities)
	if err := http.ListenAndServe(addr, nil); err != nil {
		panic(err)
	}

}
