// инициализация массива с данными о игровом поле
let source_game = [];
for (let i = 0; i < 10; i++){
    source_game[i] = [];
    for (let j = 0; j < 10; j++){
        source_game[i][j] = " ";
        let tmp = document.getElementById(String(i) + String(j));
        tmp.innerHTML = source_game[i][j];
    }
}

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
}

// выбор текущего действия
let curr_act = " ";
document.getElementById('1').addEventListener("click", function(){curr_act = 'X';});
document.getElementById('2').addEventListener("click", function(){curr_act = 'O';});
document.getElementById('3').addEventListener("click", function(){curr_act = '*';});
document.getElementById('4').addEventListener("click", function(){curr_act = '%';});

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
                if ((document.getElementById(String(k) + String(c)).innerHTML == "*" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "%" && curr_act == "%") ||
                    (document.getElementById(String(k) + String(c)).innerHTML == "X" && curr_act == "*" ||
                    document.getElementById(String(k) + String(c)).innerHTML == "O" && curr_act == "%")) {
                        isTrue = true;
                        break;
                }
            }
        }
    }
    return isTrue;
}

// отправка измененных даннх

let req = {
    i1: 1,
    j1: 1,
    val1: "X",
    i2: 1,
    j2: 1,
    val2: "X",
    i3: 1,
    j3: 1,
    val3: "X",
    move: 1
};

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

// обновление данных по таймеру
let inData;
let timetId = setInterval(function(){
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
    xhttp.send(JSON.stringify(req));
}, 10000);

function setResponseData(data){
    let id = String(data.i1) + String(data.j1);
    document.getElementById(id).innerHTML = data.val1;
    id = String(data.i2) + String(data.j2);
    document.getElementById(id).innerHTML = data.val2;
    id = String(data.i3) + String(data.j3);
    document.getElementById(id).innerHTML = data.val3;

}