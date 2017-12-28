package main

import (
	"log"
	"fmt"
	owm "github.com/briandowns/openweathermap"

	"os"
	"encoding/json"
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

func getWeather(cityId int){
	w, err := owm.NewCurrent("C", "en", os.Getenv("OWM_API_KEY")) // fahrenheit (imperial) with Russian output
	if err != nil {
		log.Fatalln(err)
	}

	w.CurrentByID(cityId)

	weather := Weather{cityId, w.GeoPos.Longitude, w.GeoPos.Latitude, w.Main.Temp,
	w.Main.TempMin, w.Main.TempMax, w.Weather[0].Description, w.Wind.Speed, w.Wind.Deg,
	w.Main.Humidity, w.Main.Pressure, w.Sys.Sunrise, w.Sys.Sunset, w.Dt}

	weatherMarshalled, _ := json.Marshal(weather)
	fmt.Printf("%s\n", weatherMarshalled)
	
}

func main() {
	os.Setenv("OWM_API_KEY", "cde3fd92c6a3989c1f6c2b70f2d6a448")


	fmt.Println(os.Getenv("OWM_API_KEY"))

	getWeather(2172797)



	//fmt.Println(w)
}
