// create rows
createExpenseRows = function(dataParams,table,expenseId,expenseCost,expenseTitle,row){
    for(let j=0; j<3; j++){
        if (j==0){
            let field = document.createElement("td");
            field.textContent = expenseTitle;
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
                fetch(`http://127.0.0.1:5000/expense/${expenseId}`, dataParams)
                .then(response => response.json())
                .then(function(result){
                    expenseTitle = result.data.expense_title
                    editBox.setAttribute("value", expenseTitle)
                    editBox.addEventListener('blur',()=>{
                        if (editBox.value == expenseTitle){
                            editBox.remove()
                            field.textContent = expenseTitle
                        }else{

                            let data = {
                                'expense_title': editBox.value,
                            } 
                            let dataParams = {
                                method: 'PUT',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            }
                            fetch(`http://127.0.0.1:5000/expenses/title/${budgetId}/${expenseId}`, dataParams)
                            .then(response => response.json())
                            .then(function(result){
                                if (result.data == null){
                                    errorMessage(result.error)
                                }else{
                                    let newData = result.data
                                    editBox.remove();
                                    field.textContent = newData.expense_title
                                }
                            });
                        }
                    });
                });
            });

        }else if(j==1){
            let field = document.createElement("td");
            field.textContent = expenseCost;
            row.append(field);
            field.addEventListener('click', ()=>{
                let editCost = document.createElement("input");
                field.textContent = " ";
                editCost.setAttribute("type", "text");
                field.appendChild(editCost)
                editCost.addEventListener('click', event =>{
                    event.stopPropagation()
                })
                editCost.focus()
                fetch(`http://127.0.0.1:5000/expense/${expenseId}`, dataParams)
                .then(response => response.json())
                .then(function(result){
                    expenseCost = result.data.expense_cost
                    editCost.setAttribute("value", expenseCost)
                    editCost.addEventListener('blur',()=>{
                        if (editCost.value == expenseCost){
                            editCost.remove()
                            field.textContent = expenseCost
                        }else{
                            let data = {
                                'expense_cost': Number(editCost.value),
                            } 
                            let dataParams = {
                                method: 'PUT',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            }
                            fetch(`http://127.0.0.1:5000/expenses/cost/${budgetId}/${expenseId}`, dataParams)
                            .then(response => response.json())
                            .then(function(result){
                                if (result.data == null){
                                    errorMessage(result.error)
                                }else{
                                    let newData = result.data
                                    editCost.remove();
                                    field.textContent = newData.expense_cost
                                }
                            });
                        }
                    });
                });
            }); 
        }else if (j==2){
            let field = document.createElement("td");
            let delBtn = document.createElement("button")
            delBtn.textContent="delete"
            field.appendChild(delBtn)
            row.appendChild(field)
            delBtn.addEventListener('click', () =>{
                let dataParams = {
                    method:'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
                fetch(`http://127.0.0.1:5000/expenses/${expenseId}`, dataParams)
                .then(response => response.json())
                .then(function(result){
                    let delRow = document.getElementById("row-"+expenseId);
                    delRow.remove();
                });
            });
        }
    }
    table.append(row)
}

getAllExpenses = function (budgetId){ 
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch(`http://127.0.0.1:5000/expenses/${budgetId}`, dataParams)
    .then(response => response.json())
    .then(function(result){
        let table = document.getElementsByTagName("table")[0]
        if (result.data == null){
            return window.location.replace('http://localhost:8000/index.html')
        }else{
            res = Object.keys(result.data)[0]
            for(let item of result.data[res]){
                let expenseId = item.expense_id;
                let expenseCost = item.expense_cost;
                let expenseTitle = item.expense_title
                let row = document.createElement("tr");
                row.setAttribute("id","row-"+expenseId);
                createExpenseRows(dataParams,table,expenseId,expenseCost,expenseTitle,row)
            }
        }
    });
}


addNewExpenses = function(){
    let addNewExpenseBtn = document.getElementById("add-expense");
    let form = document.getElementById("add-expense-form")
    
    addNewExpenseBtn.addEventListener("click", () => {

        if (addNewExpenseBtn.textContent == "New"){
            let titleInput = document.createElement("input")
            let costInput = document.createElement("input")
            let clsbtn = document.createElement("input")
            
            clsbtn.textContent = "close"
            titleInput.setAttribute("type","text")
            titleInput.setAttribute("id","expense-title")
            titleInput.setAttribute("placeholder","Expense Title")
            costInput.setAttribute("type","text")
            costInput.setAttribute("id","expense-cost")
            costInput.setAttribute("placeholder","Expense Cost")
            clsbtn.setAttribute("id","close-btn")
            clsbtn.setAttribute("type","button")
            clsbtn.setAttribute("value","close")
            clsbtn.addEventListener('click', function(){
                addNewExpenseBtn.textContent = "New"
                titleInput.remove();
                costInput.remove();
                clsbtn.remove()
            })
            form.appendChild(titleInput)
            form.appendChild(costInput)
            form.appendChild(clsbtn)
            titleInput.focus()
            addNewExpenseBtn.textContent = "Save"
        } else if ( addNewExpenseBtn.textContent == "Save"){
            let expenseTitleInput = document.getElementById("expense-title")
            let expenseCostInput = document.getElementById("expense-cost")
            // if (expenseTitleInput.value == "" || expenseCostInput.value == ""){
            //     errorMessage(result)
            // } else{
            let clsbtn = document.getElementById("close-btn")
            let newExpenseData = {
                'exp_title': expenseTitleInput.value,
                'exp_cost': expenseCostInput.value
            }
            let dataParams = {
                method:'POST',
                body:JSON.stringify(newExpenseData),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
            fetch(`http://127.0.0.1:5000/expenses/${budgetId}`, dataParams)
            .then(response => response.json())
            .then(function(result){
                if(result.data == null){
                    addNewExpenseBtn.textContent = "New"
                    expenseTitleInput.remove();
                    expenseCostInput.remove();
                    clsbtn.remove();
                    errorMessage(result.error)                                                        
                }else{
                    newlyAddedExpense = result.data
                    addNewExpenseBtn.textContent = "New"
                    expenseTitleInput.remove();
                    expenseCostInput.remove();
                    clsbtn.remove()
                    getSingleEXpense(newlyAddedExpense.expense_id);
                }
            
            })
            // }   
        }

    });
}



getSingleEXpense = function (expenseId){ 
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch(`http://127.0.0.1:5000/expense/${expenseId}`, dataParams)
    .then(response => response.json())
    .then(function(result){
        let table = document.getElementsByTagName("table")[0]
        if (result.data == null){
            return window.location.replace('http://localhost:8000/index.html')
        }else{
            let item = result.data
            let expenseId = item.expense_id;
            let expenseCost = item.expense_cost;
            let expenseTitle = item.expense_title
            let row = document.createElement("tr");
            row.setAttribute("id","row-"+expenseId);
            createExpenseRows(dataParams,table,expenseId,expenseCost,expenseTitle,row)
        }
    });
}
   

window.addEventListener("load", () => {
    let url = window.location.href
    budgetId = url.split("?")[1]

    getAllExpenses(budgetId);
    addNewExpenses();
});


function errorMessage(message){
    document.getElementById("error-message").textContent = message
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function(){
        document.getElementById("error-message").textContent =" "
    },3000)
}