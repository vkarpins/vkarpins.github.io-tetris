package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB
var err error

type Score struct {
	Name  string `json:"name"`
	Score string    `json:"score"`
	Time  string `json:"time"`
}

func init() {
	db, err = sql.Open("sqlite3", "./database/score.db")
	if err != nil {
		log.Fatal(err)
	}
	createTablesIfNotExists()
}

func createTablesIfNotExists() {
	statement, _ := db.Prepare(`CREATE TABLE IF NOT EXISTS score (name TEXT, score INTEGER, time TEXT);`)
	statement.Exec()
}

func AddScore(name string, score string, time string) {
	statement, err := db.Prepare("INSERT INTO score (name, score, time) VALUES (?,?,?)")
	if err != nil {
		fmt.Println(err)
	}
	statement.Exec(name, score, time)
}

func ReadScore() []Score {
	var scoreList []Score
	rows, err := db.Query("SELECT name, score, time FROM score")
	if err != nil {
		fmt.Println(err)
	}
	for rows.Next() {
		var score Score
		err = rows.Scan(
			&score.Name,
			&score.Score,
			&score.Time,
		)
		if err != nil {
			fmt.Println(err)
			continue
		}
		scoreList = append(scoreList, score)
	}
	return scoreList
}
