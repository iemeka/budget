// create rows of data
createRows = function(dataParams,table,budgetId,budgetTitle,row){
    for(let j=0; j< 3; j++){
        if (j==0){
            let field = document.createElement("td");
            field.textContent = budgetTitle;
            row.append(field)
            field.addEventListener('click', ()=>{
                let editBox = document.createElement("input")
                field.textContent = " "
                editBox.setAttribute("type", "text")
                field.appendChild(editBox)
                editBox.addEventListener('click', event =>{
                    event.stopPropagation()
                })
                editBox.focus()
                fetch(`http://127.0.0.1:5000/budget/${budgetId}`, dataParams)
                .then(response => response.json())
                .then(function(result){
                    budgetTitle = result.data.budget_title;
                    editBox.setAttribute("value", budgetTitle)
                    editBox.addEventListener('blur',()=>{
                        if (editBox.value == budgetTitle){
                            editBox.remove()
                            field.textContent = budgetTitle
                        }else{
                            let data = {
                                'budget_title': editBox.value,
                            } 
                            let dataParams = {
                                method: 'PUT',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            }
                            fetch(`http://127.0.0.1:5000/budget/${budgetId}`, dataParams)
                            .then(response => response.json())
                            .then(function(result){
                                if (result.data == null){
                                    errorMessage(result.error)
                                    editBox.remove();
                                    field.textContent = budgetTitle
                                }else{
                                    let newData = result.data
                                    editBox.remove();
                                    field.textContent = newData.budget_title
                                }
                            })
                        }
                    });
                });
            });
            
        } else if (j==1){
            let field = document.createElement("td");
            field.textContent = budgetId
            row.append(field)
        } else if (j==2){
            let field = document.createElement("td");
            let delBtn = document.createElement("button")
            let openBtn = document.createElement("button")
            delBtn.textContent="delete"
            openBtn.textContent="open"
            field.appendChild(delBtn)
            field.appendChild(openBtn)
            row.appendChild(field)
            delBtn.addEventListener('click', () => {
                let dataParams = {
                    method:'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
                fetch(`http://127.0.0.1:5000/budget/${budgetId}`, dataParams)
                .then(response => response.json())
                .then(function(result){
                    let delRow = document.getElementById("row-"+budgetId);
                    delRow.remove();
                });
            });

            openBtn.addEventListener('click', ()=> {
                return window.location.replace(`http://localhost:8000/expense.html?${budgetId}`)
            })
        }
        
    }
    table.append(row);
}

// get all budget from data base
getAllbudgets = function (){    
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch('http://127.0.0.1:5000/budget', dataParams)
    .then(response => response.json())
    .then(function(result){
        let table = document.getElementsByTagName("table")[0]
        if (result.data == null){
            return window.location.replace('http://localhost:8000/index.html')
        }else{
            for(let item of result.data){
                let budgetId = item.budget_id;
                let budgetTitle = item.budget_title
                let row = document.createElement("tr");
                row.setAttribute("id","row-"+budgetId)
                createRows(dataParams,table,budgetId,budgetTitle,row)
            }
        }
        
    });
}

// add new budget to data base
addNewBudget = function(){
    let addNewBudgetBtn = document.getElementById("add-budget");
    let form = document.getElementById("add-budget-form")
    addNewBudgetBtn.addEventListener("click", () => {
        if ( addNewBudgetBtn.textContent == "New"){
            let input = document.createElement("input")
            let clsbtn = document.createElement("input")
            clsbtn.textContent = "close"
            input.setAttribute("type","text")
            input.setAttribute("id","budget-title")
            clsbtn.setAttribute("id","close-btn")
            clsbtn.setAttribute("type","button")
            clsbtn.setAttribute("value","close")
            clsbtn.addEventListener('click', function(){
                addNewBudgetBtn.textContent = "New"
                input.remove();
                clsbtn.remove()
            })
            form.appendChild(input)
            form.appendChild(clsbtn)
            input.focus()
            addNewBudgetBtn.textContent = "Save"
        } else if ( addNewBudgetBtn.textContent == "Save"){
            let budgetTitleInput = document.getElementById("budget-title")
            if (budgetTitleInput == ""){
                errorMessage(result.error)
            }else{

                let clsbtn = document.getElementById("close-btn")
                let newTitle = {
                    'budget_title': budgetTitleInput.value
                }
                let dataParams = {
                    method:'POST',
                    body:JSON.stringify(newTitle),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
                fetch('http://127.0.0.1:5000/budget', dataParams)
                .then(response => response.json())
                .then(function(result){
                    if(result.data == null){
                        addNewBudgetBtn.textContent = "New"
                        budgetTitleInput.remove();
                        clsbtn.remove()
                        errorMessage(result.error)
                    }else{
                        newlyAddedBudget = result.data
                        addNewBudgetBtn.textContent = "New"
                        budgetTitleInput.remove();
                        clsbtn.remove()
                        getSinglebudget(newlyAddedBudget.budget_id);
                    }
                
                });
            }
        }

    });
}



// get a single budget from data base
getSinglebudget = function (budgetId){    
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch(`http://127.0.0.1:5000/budget/${budgetId}`, dataParams)
    .then(response => response.json())
    .then(function(result){
        let table = document.getElementsByTagName("table")[0];
        if (result.data == null){
            return window.location.replace('http://localhost:8000/index.html');
        }else{
            let item = result.data;
            let budgetId = item.budget_id;
            let budgetTitle = item.budget_title;
            let row = document.createElement("tr");
            row.setAttribute("id","row-"+budgetId);
            createRows(dataParams,table,budgetId,budgetTitle,row);
        }
    });
}


window.addEventListener("load", () => {
    getAllbudgets();
    addNewBudget();
});
    
    
   
function errorMessage(message){
    document.getElementById("error-message").textContent = message
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function(){
        document.getElementById("error-message").textContent =" "
    },3000)
}