let button = document.getElementById("signup");

button.addEventListener("click", (event) => {
    event.preventDefault();
    let username = document.getElementById("name").value;
    let password = document.getElementById("pass").value;
    let user = {
    'username':username,
    'password':password
    }
    let dataParams = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch('https://bud-api.herokuapp.com/signup', dataParams)
    .then(response => response.json())
    .then(function(result){
        if (result.data == null){
            return errorMessage(result.error);
        }
        return window.location.replace(`http://localhost:8000/app.html?${username}`)
    });
});
