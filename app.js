var express = require('express'), //есть
    bodyParser = require('body-parser'), //есть
    path = require('path'), //есть
    moment = require('moment'), //есть
    conform = require('conform'), //есть
    requirejs = require('requirejs'),
    backbone = require('backbone'),
    underscore = require('underscore'),
    mongoClient = require('mongodb').MongoClient;

var db;
    
    app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'pr')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get("/", function (req, res) {
    
    db.collection('coment').find().toArray(function(err, docs) {
        if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        var time = [];
        for (var i = 0; i < docs.length; i++) {
            time.push({time: moment(docs[i].time, "YYYYMMDDhmmss").fromNow()});
        }
        var global = {
            post: docs,
            time: time,
            docs: docs
        }
        res.render('index.ejs', {global: global});
    });
});



var jsonParser = bodyParser.json();


app.post('/', jsonParser, function(req, res) {
    
    
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    
    var name = req.body.name,
        content = req.body.content,
        theme = req.body.theme,
        time = moment().format("YYYYMMDDhmmss"),
        con = {name: name, content: content, theme: theme, time: time},
        ia = conform.validate(con, {
        properties: {
            name: {
                type: 'string',
                minLength: 3,
                maxLength: 20
            },
            content: {
                type: 'string',
                minLength: 3,
                maxLength: 450
            },
            theme: {
                type: 'string',
                minLength: 3,
                maxLength: 40
            }
        }
    });
    if (ia.valid == true) {
        db.collection('coment').insert(con, function(err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
           console.log(result);
            result.ops[0].time =  moment(result.ops[0].time, "YYYYMMDDhmmss").fromNow();
            res.json(result.ops[0]);
        });
    } else {
        res.json(1);
    }
    
})

mongoClient.connect('mongodb://localhost:27017/coment', function(err, database) {
   if (err) {
       return console.log(err);
   } 
    db = database;
    app.listen(3000, function () {
    console.log("nice");
});
});