let button = document.getElementById("signup");
let username = document.getElementById("name");
let password = document.getElementById("pass");

button.addEventListener("click", () => {
    let request = new XMLHttpRequest()
    request.open('POST','http://127.0.0.1:5000/signup', true);
    request.setRequestHeader('content-type', 'application/json');
    request.onreadystatechange = function (){
        if (request.readyState == 4 && request.status == 200){
            console.log(request.responseText)
        }
    }
    request.send(JSON.stringify({'username':username.value, 'password':password.value}));
});