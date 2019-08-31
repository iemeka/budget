let button = document.getElementById("signup");

button.addEventListener("click", () => {
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
    fetch('http://127.0.0.1:5000/signup', dataParams)
    .then(response => response.json())
    .then(function(result){
        if (result.data == null){
            return document.getElementById('error-message').textContent = result.error
        }
        return window.location.replace('http://localhost:8000/budget.html')
    });
});