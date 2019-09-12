let button = document.getElementById("login");

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
    fetch('https://dbudget-api-heroku.herokuapp.com/login', dataParams)
    .then(response => response.json())
    .then(function(result){
        if (result.data == null){
            return document.getElementById('error-message').textContent = result.error
        }
        return window.location.replace('https://dbudget-api-heroku.herokuapp.com/budget.html')
    });
});

