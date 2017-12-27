package main

import (
	"log"
	"fmt"
	owm "github.com/briandowns/openweathermap"

	"os"
)

type Location struct{
	longitude float64
	latitude float64
}

func main() {
	os.Setenv("OWM_API_KEY", "cde3fd92c6a3989c1f6c2b70f2d6a448")


	fmt.Println(os.Getenv("OWM_API_KEY"))
	w, err := owm.NewCurrent("C", "en", os.Getenv("OWM_API_KEY")) // fahrenheit (imperial) with Russian output
	if err != nil {
		log.Fatalln(err)
	}

	w.CurrentByName("London")


	//location := Location{w.GeoPos.Longitude, w.GeoPos.Latitude}

	fmt.Println(w)
}
