// выдача страниц
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
//let util = require("util");

let urlencodedParser = bodyParser.urlencoded({extended: false});
let isFirst = true;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
    //res.send(isFirst);
    isFirst = false;
});

app.use(express.static("client"));
app.use(express.urlencoded({extended: false}));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// прием, обработка и отправка данных

let data;
app.post('/', urlencodedParser, function(req, res) {
    // console.log("not null");
    // util.inspect(req.body, false, null);
    data = req.body;
    console.log(data);
    return res.sendStatus(200);
    
});
