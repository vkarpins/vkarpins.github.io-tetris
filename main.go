package main

import (
	"encoding/json"
	"fmt"
	"log"
	"make-your-game-different-maps/database"
	"net/http"
	"text/template"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))
	http.HandleFunc("/", handler)
	http.HandleFunc("/writeScore", writeScoreHandler)
	http.HandleFunc("/readScore", readScoreHandler)

	fmt.Printf("Starting server at port 8080\n\n")
	fmt.Printf("http://localhost:8080/\n")

	// Creates the server
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("%v - internal server error", http.StatusInternalServerError)
	}
}

func handler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		log.Fatal(err)
	}
	if r.URL.Path != "/" {
		ErrorHandler(w, r, http.StatusNotFound)
		return
	}
	// score := database.ReadScore()
	tmpl.Execute(w, nil)
}

func writeScoreHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/writeScore" {
		ErrorHandler(w, r, http.StatusNotFound)
		return
	}
	var InputData database.Score
	err := json.NewDecoder(r.Body).Decode(&InputData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	database.AddScore(InputData.Name, InputData.Score, InputData.Time)
}

func readScoreHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/readScore" {
		ErrorHandler(w, r, http.StatusNotFound)
		return
	}
	OutputData := database.ReadScore()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(OutputData)
}

func ErrorHandler(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	temp := template.Must(template.ParseFiles("error.html"))
	var er string
	switch status {
	case http.StatusNotFound:
		er = "404 Page not found"
	case http.StatusMethodNotAllowed:
		er = "405 Method not allowed"
	case http.StatusBadRequest:
		er = "500 Bad request"
	default:
		er = "Something went wrong"
	}
	temp.Execute(w, er)
}
