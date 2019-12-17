// выдача страниц
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
//let util = require("util");

let urlencodedParser = bodyParser.urlencoded({extended: true});
let clc = 0;

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
    console.log("in index.html");
    console.log(clc);
    clc++;
});

app.post('/index.html', urlencodedParser, function(req, res) {
    return res.send(String(clc));
});

app.get('/game.html', function (req, res) {
    res.sendFile(__dirname + '/client/game.html');
    //res.redirect(__dirname + '/client/game.html');
    //console.log(clc);
    console.log("in game.html");
    //clc++;
});

app.use(express.static("client"));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// прием, обработка и отправка данных

let move = 1;
let request;
let data;
app.post('/game.html', urlencodedParser, function(req, res) {
    data = req.body;
    if (move === data.move){
        request = data;
        if (move === 1)
            move = 2;
        else if (move === 2)
            move = 1;
    }
    console.log(request);
    return res.json(request);
});
