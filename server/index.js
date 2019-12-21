// выдача страниц
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let MongoClient = require("mongodb").MongoClient;

let urlencodedParser = bodyParser.urlencoded({extended: true});
let clc1 = 0;
let clientCount = 0;
let clientOut = false;
let dburl = "mongodb://localhost:27018";
let dbname = "gamesCollection"

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
    console.log("in index.html");
    console.log(clc1);
    clc1++;
});

app.post('/index.html', urlencodedParser, function(req, res) {
    return res.send(String(clc1));
});

app.post('/game1.html', urlencodedParser, function(req, res) {
    clientCount++;
    return res.send(String(clientCount));
});

app.get('/game.html', function (req, res) {
    res.sendFile(__dirname + '/client/game.html');
    console.log("in game.html");
});

app.use(express.static("client"));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// прием, обработка и отправка данных


let request = {
    i1: -1,
    j1: -1,
    val1: "X",
    i2: -1,
    j2: -1,
    val2: "X",
    i3: -1,
    j3: -1,
    val3: "X",
    move: -1,
    alvX: 1,
    alvO: 1,
    isDisconnect: false
};

let move = 1;
let data;
app.post('/game.html', urlencodedParser, function(req, res) {
    data = req.body;
    if (clientOut == true){
        request.isDisconnect = true;
        return res.json(request);
    }
    if (move === data.move && clientOut == false){
        request = data;
        if (move === 1)
            move = 2;
        else if (move === 2)
            move = 1;
    }
    return res.json(request);
});


app.post("/check", urlencodedParser, function(req, res){
    clientCount--;
    clientOut = true;
    console.log(clientCount);
});

app.get("/gameover", urlencodedParser, function(req, res){
    clientOut = true;
    clientCount--;
    res.sendFile(__dirname + '/client/index.html');
});

app.post("/gameover", urlencodedParser, function(req, res){
    if (clientOut == true)
        res.send("no");
});

app.post("/insertdb", urlencodedParser, function (req, res) {
    MongoClient.connect(dburl, function (err, client) {
        let db = client.db(dbname);
        let collection = db.collection('games');

        let games = req.body;

        collection.insertOne(games, function(err, result){
            if(err){
                console.log(err);
                return;
            }
            console.log(result.ops);
            client.close();
        });
    });
});


app.post("/getFromDB", urlencodedParser, function(req, res){
    MongoClient.connect(dburl, function (err, client) {
        let db = client.db(dbname);
        let collection = db.collection("games");
        res1 = collection.find().toArray(function (err, result) {
            console.log(result);
            res.json(result);
            client.close();
            return res
        });
    });
});