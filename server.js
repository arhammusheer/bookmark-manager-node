var express = require("express")
var app = express()
var db = require("./db.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 80

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
//html dependencies
app.get('/dependencies/css/bookmarkManager.css', function(req, res){
     res.sendFile(__dirname + '/html/dependencies/css/bookmarkManager.css'); 
    });

// html endpoints
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + '/html/index.html');
});

app.get("/bookmark/id/:id",(req, res, next) => {
    res.sendFile(__dirname + '/html/bookmark.html');
} );

app.get("/bookmark/create",(req, res, next) => {
    res.sendFile(__dirname + '/html/createBookmark.html');
} );

app.get("/bookmark/edit/:id",(req, res, next) => {
    res.sendFile(__dirname + '/html/editBookmark.html');
} );

app.get("/tag/id/:id",(req, res, next) => {
    res.sendFile(__dirname + '/html/tag.html');
} );

app.get("/tag/create",(req, res, next) => {
    res.sendFile(__dirname + '/html/createTag.html');
} );

app.get("/tag/edit/:id",(req, res, next) => {
    res.sendFile(__dirname + '/html/editTag.html');
} );

//API endpoints
app.get("/api", (req, res, next) => {
    res.json({"message":"success"});
});

//Bookmarks Endpoints
app.get("/api/bookmark", (req, res, next) => {
    var sql = "select * from bookmark"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/bookmark/id/:id", (req, res, next) => {
    var sqlCommand = "select * from bookmark where id = ?"
    var params = [req.params.id]
    db.get(sqlCommand, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if(row){
            res.json({
                "message":"success",
                "data":row
            })
        } else {
            res.json({
                "message":"success",
                "warning":"No data"
            })
        }
      });
});

app.post("/api/bookmark/create/", (req, res, next) => {
    var errors=[]
    var data = {
        link: req.body.link,
        title: req.body.title,
        publisher: req.body.publisher,
        tags: req.body.tags
    }
    var sql ='INSERT INTO bookmark (link,title,publisher,tags) VALUES (?,?,?,?)'
    var params =[data.link, data.title, data.publisher, data.tags]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.put("/api/bookmark/edit/:id", (req, res, next) => {
    var errors=[]

    var data = {
        id: req.params.id,
        link: req.body.link,
        title: req.body.title,
        publisher: req.body.publisher,
        tags: req.body.tags,
        updateTime : new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    var sql ='UPDATE bookmark SET link = ?,title = ?,publisher = ?,tags = ?, time_updated= ? WHERE id= ?'
    var params =[data.link, data.title, data.publisher, data.tags, data.updateTime, data.id]
    console.log(data);
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.delete('/api/bookmark/id/:id', function (req, res) {
    var sqlCommand = "DELETE FROM bookmark WHERE id = ?"
    var params = [req.params.id]
    db.get(sqlCommand, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
})

//Tags Endpoints
app.get("/api/tag", (req, res, next) => {
    var sql = "select * from tag"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/tag/id/:id", (req, res, next) => {
    var sqlCommand = "select * from tag where id = ?"
    var params = [req.params.id]
    db.get(sqlCommand, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        if(row){
            res.json({
                "message":"success",
                "data":row
            })
        } else {
            res.json({
                "message":"success",
                "warning":"No data"
            })
        }
      });
});

app.post("/api/tag/create", (req, res, next) => {
    var errors=[]
    var data = {
        title: req.body.title
    }
    var sql ='INSERT INTO tag (title) VALUES (?)'
    var params =[data.title]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.put("/api/tag/edit/:id", (req, res, next) => {
    var errors=[]
    var data = {
        id: req.params.id,
        title: req.body.title,
        updateTime : new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    var sql ='UPDATE tag SET title = ?, time_updated= ? WHERE id= ?'
    var params =[data.title, data.updateTime, data.id]
    console.log(data);
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})


app.delete('/api/tag/id/:id', function (req, res) {
    var sqlCommand = "DELETE FROM tag WHERE id = ?"
    var params = [req.params.id]
    db.get(sqlCommand, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
  })


// Handle 404
app.use(function(req, res) {
    res.status(404).send('404: Page not found');
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error');
  });