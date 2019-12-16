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
    setData(Number(curr_id[0]), Number(curr_id[1]), curr_act);
    td.innerHTML = curr_act;
}

// выбор текущего действия
let curr_act = " ";
document.getElementById('1').addEventListener("click", function(){curr_act = 'X';});
document.getElementById('2').addEventListener("click", function(){curr_act = 'O';});
document.getElementById('3').addEventListener("click", function(){curr_act = '*';});
document.getElementById('4').addEventListener("click", function(){curr_act = '%';});

// механика игры
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

let next_act = document.getElementById("next_act");
next_act.onclick = function(event) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("данные отправлены");
            /// console.log(this.responseText);
        }
    }

    let formData = new FormData();
    formData.append("name", source_game);
    xhttp.open("POST", "http://127.0.0.1:3000/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formData);
    outData.length = 0;
}

let outData = [];
function setData(i, j, data) {
    outData.push(i);
    outData.push(j);
    outData.push(data);
}

// обновление данных по таймеру
let inData;
let timetId = setInterval(function(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("данные приняты по таймеру");
            inData = this.responseText;
            console.log(inData);
        }
    }

    //let formData = new FormData();
    //formData.append("name", source_game);
    xhttp.open("POST", "http://127.0.0.1:3000/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let = body = "name" + encodeURIComponent(source_game);
    xhttp.send(body);
}, 10000);
