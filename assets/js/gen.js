function errorMessage(message){
    document.getElementById("error-message").textContent = message;
    let indicator = document.getElementById("noti-circle");
    indicator.style.backgroundColor = "red";
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function(){
        document.getElementById("error-message").textContent =" ";
        indicator.style.backgroundColor = "white";
    },3000)
}