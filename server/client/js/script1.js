let button = document.getElementById("btn");
document.addEventListener("DOMContentLoaded", function(event) {
    let clientCount = 0;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("определили номер клиента");
            clientCount = Number(this.response);
            if (clientCount === 2){
                button.innerHTML = "Присоединиться к игре";
            }
        }
    }

    xhttp.open("POST", "http://127.0.0.1:3000/index.html", true);
    xhttp.send();
});

/*button.addEventListener("click", function(event){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("данные отправлены");
            document = this.response;
        }
    }

    xhttp.open("GET", "http://127.0.0.1:3000/game.html", true);
    xhttp.send();
});*/