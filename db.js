var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "db.sqlite3"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE "bookmark" (
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "link"	TEXT UNIQUE,
            "title"	TEXT NOT NULL,
            "time_updated"	DATETIME,
            "time_created"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "publisher"	TEXT NOT NULL,
            "tags"	TEXT NOT NULL
        )`,
        (err) => {
            if (err) {
                console.log("Table bookmarks exists");
            }else{
               console.log("table bookmarks generated")
            }
        });  
        db.run(`CREATE TABLE "tag" (
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "title"	TEXT NOT NULL UNIQUE,
            "time_created"	DATETIME DEFAULT CURRENT_TIMESTAMP,
            "time_updated" DATETIME
        )`,
        (err) => {
            if (err) {
                console.log("Table tags exists");
            }else{
               console.log("table tags generated")
            }
        });  
    }
});


module.exports = db
