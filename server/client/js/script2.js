// инициализация массива с данными о игровом поле
let moveCount = 2;
let clientNumber;
let isMyMove;
let source_game = [];
for (let i = 0; i < 10; i++){
    source_game[i] = [];
    for (let j = 0; j < 10; j++){
        source_game[i][j] = " ";
        let tmp = document.getElementById(String(i) + String(j));
        tmp.innerHTML = source_game[i][j];
    }
}

// начало игры
let start = document.getElementById("start");
start.addEventListener("click", function(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            clientNumber = Number(this.response);
            isMyMove = clientNumber == 1 ? true : false;
            req = {
                i1: -1,
                j1: -1,
                val1: "X",
                i2: -1,
                j2: -1,
                val2: "X",
                i3: -1,
                j3: -1,
                val3: "X",
                move: clientNumber
            };
            if(clientNumber == 1){
                document.getElementById("yourMove").style.display = "block";
                document.getElementById("2").style.display = 'none';
                document.getElementById("4").style.display = 'none';
            } else if (clientNumber == 2){
                document.getElementById("yourMove").style.display = "block";
                document.getElementById("yourMove").innerHTML = "Ход противника";
                document.getElementById("1").style.display = 'none';
                document.getElementById("3").style.display = 'none';
            }
            start.style.display = "none";
            document.getElementById("game_options").style.display = "flex";
            document.getElementById("next_action").style.display = "flex";
        }
    }
    xhttp.open("POST", "http://127.0.0.1:3000/game1.html", true);
    xhttp.responseType = 'text';
    xhttp.send();
});

// внесение начальных данных в игру
source_game[9][0] = "X";
let tmp = document.getElementById("90");
tmp.innerHTML = source_game[9][0];
source_game[0][9] = "O";
tmp = document.getElementById("09");
tmp.innerHTML = source_game[0][9];

// создание события, нажатия на таблицу с игрой
let table = document.getElementById("tb");

table.onclick = function(event) {
    if (moveCount == 0)
        return;
    let td = event.target.closest('td');
    if (!td)
        return;
    let cl = td.getAttribute("class");
    if (cl == "nav")
        return;
    let curr_id = td.getAttribute("id");
    if (!canSetPoint(Number(curr_id[0]), Number(curr_id[1])))
        return;
    source_game[Number(curr_id[0])][Number(curr_id[1])] = curr_act;
    reqForm(tapCount, Number(curr_id[0]), Number(curr_id[1]), curr_act);
    if (tapCount < 3)
        tapCount++;
    else
        tapCount = 1;
    td.innerHTML = curr_act;
    moveCount--;
}

// выбор текущего действия
let curr_act = " ";
document.getElementById('1').addEventListener("click", function(){
    curr_act = 'X'; 
    this.style.backgroundColor = "blue";
    document.getElementById('3').style.backgroundColor = "red";
});
document.getElementById('2').addEventListener("click", function(){
    curr_act = 'O'; 
    this.style.backgroundColor = "blue";
    document.getElementById('4').style.backgroundColor = "red";
});
document.getElementById('3').addEventListener("click", function(){
    curr_act = '*'; 
    this.style.backgroundColor = "blue";
    document.getElementById('1').style.backgroundColor = "red";
});
document.getElementById('4').addEventListener("click", function(){
    curr_act = '%'; 
    this.style.backgroundColor = "blue";
    document.getElementById('2').style.backgroundColor = "red";
});

// механика игры

tapCount = 1;
function canSetPoint(i, j) {
    let isTrue = false;
    if (source_game[i][j] == " " && curr_act != "*" && curr_act != "%") {
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k == i && c == j)
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == curr_act || 
                    document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "X" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "O") {
                    isTrue = true;
                    break;
                }
            }
        }
        return isTrue;
    }
    if ((source_game[i][j] == "X" && curr_act == "%") || (source_game[i][j] == "O" && curr_act == "*")){
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k == i && c == j)
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "*") {
                    isTrue = true;
                    break;
                } else if (document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%")
                    canSetPoint(k, c);
            }
        }
    }
    if (source_game[i][j] == "*" && curr_act == "*" || source_game[i][j] == "%" && curr_act == "%"){
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k == i && c == j)
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "*"){
                    isTrue = true;
                    break;
                }
                if (document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%")
                    canSetPoint(k, c);
            }
        }
    }
    return isTrue;
}

// отправка измененных даннх

let req;
function reqForm(count, i, j, val){
    if (count == 1){
        req.i1 = i;
        req.j1 = j;
        req.val1 = val;
    } else if (count == 2){
        req.i2 = i;
        req.j2 = j;
        req.val2 = val;
    } else if (count == 3){
        req.i3 = i;
        req.j3 = j;
        req.val3 = val;
    }
}

let next_act = document.getElementById("next_act");
next_act.onclick = function(event) {
    if (isMyMove == true){
        moveCount = 3;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("данные отправлены");
            }
        }
        xhttp.open("POST", "http://127.0.0.1:3000/game.html", true);
        xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
        xhttp.send(JSON.stringify(req));
    }
    isMyMove = false;
    document.getElementById("yourMove").innerHTML = "Ход противника";
}

// обновление данных по таймеру
let inData;
let timetId = setInterval(function(){
    if (isMyMove == false){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("данные приняты по таймеру");
                inData = this.response;
                console.log(inData);
                setResponseData(inData);
            }
        }
        xhttp.open("POST", "http://127.0.0.1:3000/game.html", true);
        xhttp.responseType = 'json';
        xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
        xhttp.send();
    }
}, 10000);

function setResponseData(data){
    let countIsTr = 0;
    let id = String(data.i1) + String(data.j1);
    if (id != "-1-1"){
        document.getElementById(id).innerHTML = data.val1;
        source_game[Number(id[0])][Number(id[1])] = data.val1;
        countIsTr++;
    }
    id = String(data.i2) + String(data.j2);
    if (id != "-1-1"){
        document.getElementById(id).innerHTML = data.val2;
        source_game[Number(id[0])][Number(id[1])] = data.val2;
        countIsTr++;
    }
    id = String(data.i3) + String(data.j3);
    if (id != "-1-1"){
        document.getElementById(id).innerHTML = data.val3;
        source_game[Number(id[0])][Number(id[1])] = data.val3;
        countIsTr++;
    }
    if (countIsTr >= 2 && clientNumber != data.move){
        isMyMove = true;
        document.getElementById("yourMove").innerHTML = "Твой ход";
    }
}

// проверка на выход игрока
window.onbeforeunload = function(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("проверка на выход");
            if (this.response.isOk == false)
                console.log("противник вышел");
        }
    }
    xhttp.open("POST", "http://127.0.0.1:3000/check", true);
    xhttp.responseType = 'json';
    xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
    xhttp.send(JSON.stringify({client: clientNumber}));
}

// завершение игры
document.getElementById("give_up").onclick = function(event){

};