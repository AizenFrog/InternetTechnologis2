let button = document.getElementById("btn");
let clientCount = 0;
if (clientCount){
    button.innerHTML = "Присоединиться к игре";
}

// document.onload() = function(event){
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log("данные отправлены");
//         }
//     }

//     xhttp.open("GET", "http://127.0.0.1:3000/", true);
//     // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhttp.send();
// }