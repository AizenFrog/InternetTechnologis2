// инициализация массива с данными о игровом поле
let moveCount = 2;
let clientNumber;
let isMyMove;
let playerType;
let dateStart;
let dateEnd;
// let gameOver;
let aliveX = 1;
let aliveO = 1;
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
    dateStart = new Date();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            clientNumber = Number(this.response);
            isMyMove = clientNumber == 1 ? true : false;
            if (isMyMove)
                playerType = 1;
            else
                playerType = 2;
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
                alvX: 1,
                alvO: 1,
                move: clientNumber,
                isDisconnect: false,
                some: false
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
    if (curr_act == 'X')
        aliveX++;
    if (curr_act == 'O')
        aliveO++;
    if (curr_act == '*')
        aliveO--;
    if (curr_act == '%')
        aliveX--;
    if (aliveX == 0){
        console.log("O wins!!!");
        // allert O wins!!!!
        confirm("Вы выйграли");
        req.isDisconnect = true;
        transition();
    }
    if (aliveO == 0){
        console.log("X wins!!!");
        // allert Y wins!!!!
        confirm("Вы выйграли");
        req.isDisconnect = true;
        transition();
    }
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
                    return true;
                }
            }
        }
        return false;
    }
    if ((source_game[i][j] == "X" && curr_act == "%") || (source_game[i][j] == "O" && curr_act == "*")){
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k == i && c == j)
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "*") {
                    return true;
                }
                
            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k == i && c == j)
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%") {
                    if(canSetPointRec(k, c, i, j))
                        return true;
                }
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
                if (document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "*"){
                    return true;
                }
            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if (k == i && c == j)
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%") {
                    if (canSetPointRec(k, c, i, j))
                        return true;
                }
            }
        }
    }
    return false;
}


function canSetPointRec(i, j, _i, _j) {
    if ((source_game[i][j] == "X" && curr_act == "%") || (source_game[i][j] == "O" && curr_act == "*")) {
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k == i && c == j) || (k == _i && c == _j))
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "*") {
                    return true;
                }

            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k == i && c == j) || (k == _i && c == _j))
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%") {
                    if (canSetPointRec(k, c, i, j))
                        return true;
                }
            }
        }
    }
    if (source_game[i][j] == "*" && curr_act == "*" || source_game[i][j] == "%" && curr_act == "%") {
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k == i && c == j) || (k == _i && c == _j))
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "%" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "*") {
                    return true;
                }
            }
        }
        for (let k = i - 1; k <= i + 1; k++) {
            for (let c = j - 1; c <= j + 1; c++) {
                if ((k == i && c == j) || (k == _i && c == _j))
                    continue;
                if (k < 0 || c < 0 || k > 9 || c > 9)
                    continue;
                if (document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%") {
                    if (canSetPointRec(k, c, i, j))
                        return true;
                }
            }
        }
    }
    return false;
}

// отправка измененных данных

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
    if (isMyMove == true) {
        if (moveCount != 0) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("данные отправлены");
                }
            }
            skipAct();
            xhttp.open("POST", "http://127.0.0.1:3000/game.html", true);
            xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
            xhttp.send(JSON.stringify(req));
        }
        else {
            moveCount = 3;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("данные отправлены");
                }
            }
            xhttp.open("POST", "http://127.0.0.1:3000/game.html", true);
            xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
            req.alvX = aliveX;
            req.alvO = aliveO;
            xhttp.send(JSON.stringify(req));
        }
    }
    isMyMove = false;
    document.getElementById("yourMove").innerHTML = "Ход противника";
}

function skipAct() {
    if (req.val1 != 'Z') {
        id = String(req.i1) + String(req.j1);
        document.getElementById(id).innerHTML = req.val1;
        switch (req.val1){
            case 'O':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveO--;
                break;
            case 'X':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveX--;
                break;
            case '*':
                source_game[Number(id[0])][Number(id[1])] = 'O';
                document.getElementById(id).innerHTML = 'O';
                aliveO++;
                break;
            case '%':
                source_game[Number(id[0])][Number(id[1])] = 'X';
                document.getElementById(id).innerHTML = 'X';
                aliveX++;
                break;
        }
    }
    if (req.val2 != 'Z') {
        id = String(req.i2) + String(req.j2);
        switch (req.val2) {
            case 'O':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveO--;
                break;
            case 'X':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveX--;
                break;
            case '*':
                source_game[Number(id[0])][Number(id[1])] = 'O';
                document.getElementById(id).innerHTML = 'O';
                aliveO++;
                break;
            case '%':
                source_game[Number(id[0])][Number(id[1])] = 'X';
                document.getElementById(id).innerHTML = 'X';
                aliveX++;
                break;
        }
    }
    if (req.val3 != 'Z') {
        id = String(req.i3) + String(req.j3);
        document.getElementById(id).innerHTML = req.val3;
        switch (req.val3) {
            case 'O':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveO--;
                break;
            case 'X':
                source_game[Number(id[0])][Number(id[1])] = ' ';
                document.getElementById(id).innerHTML = ' ';
                aliveX--;
                break;
            case '*':
                source_game[Number(id[0])][Number(id[1])] = 'O';
                document.getElementById(id).innerHTML = 'O';
                aliveO++;
                break;
            case '%':
                source_game[Number(id[0])][Number(id[1])] = 'X';
                document.getElementById(id).innerHTML = 'X';
                aliveX++;
                break;
        }
    }
    req.alvX = aliveX;
    req.alvO = aliveO;
    req.some = true;
    isMyMove = false;
    document.getElementById("yourMove").innerHTML = "Ход противника";    
}

let skip_act = document.getElementById("skip_act");
skip_act.onclick = function (event) {
    if (isMyMove == true){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("данные отправлены");
            }
        }
        skipAct();
        xhttp.open("POST", "http://127.0.0.1:3000/game.html", true);
        xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
        xhttp.send(JSON.stringify(req));
    }
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
                req.val1 = 'Z';
                req.val2 = 'Z';
                req.val3 = 'Z';
                if (inData.isDisconnect == true)
                    transition();
            }
        }
        xhttp.open("POST", "http://127.0.0.1:3000/game.html", true);
        xhttp.responseType = 'json';
        xhttp.setRequestHeader("Content-type", 'application/json; charset=utf-8');
        xhttp.send();
    }
}, 3000);

function setResponseData(data){
    let countIsTr = 0;
    if (data.some != true) {
        let id = String(data.i1) + String(data.j1);
        if (id != "-1-1") {
            document.getElementById(id).innerHTML = data.val1;
            source_game[Number(id[0])][Number(id[1])] = data.val1;
            countIsTr++;
        }
        id = String(data.i2) + String(data.j2);
        if (id != "-1-1") {
            document.getElementById(id).innerHTML = data.val2;
            source_game[Number(id[0])][Number(id[1])] = data.val2;
            countIsTr++;
        }
        id = String(data.i3) + String(data.j3);
        if (id != "-1-1") {
            document.getElementById(id).innerHTML = data.val3;
            source_game[Number(id[0])][Number(id[1])] = data.val3;
            countIsTr++;
        }
    } else countIsTr = 3;
    if (countIsTr >= 2 && clientNumber != data.move){
        isMyMove = true;
        aliveX = data.alvX
        aliveO = data.alvO
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

function transition(){
    dateEnd = new Date();
    console.log(dateEnd.getMinutes() - dateStart.getMinutes());
    console.log(dateEnd.getSeconds() - dateStart.getSeconds())
    let timeOfGame = {
        minutes: dateEnd.getMinutes() - dateStart.getMinutes(),
        seconds: dateEnd.getSeconds() - dateStart.getSeconds()
    };
    console.log(JSON.stringify(dateEnd));
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.write(this.response);
        }
    }
    xhttp.open("GET", "http://127.0.0.1:3000/gameover", true);
    xhttp.responseType = "text";
    xhttp.send();
}

document.getElementById("give_up").onclick = function(event){
    confirm("Вы проиграли");
    req.isDisconnect = true;
    transition();
};
