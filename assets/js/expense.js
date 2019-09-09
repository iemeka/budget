
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
                for(let j=0; j<3; j++){
                    if (j==0){
                        let field = document.createElement("td");
                        field.textContent = expenseTitle;
                        row.append(field)
                        let timeout;                    
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
                                                document.getElementById("error-message").textContent = result.error
                                                let timeout;
                                                clearTimeout(timeout);
                                                timeout = setTimeout(function(){
                                                    document.getElementById("error-message").textContent =" "
                                                },3000)
                                                
                                            }else{
                                                let newData = result.data
                                                editBox.remove();
                                                field.textContent = newData.expense_title
                                            }
                                        });
                                    }
                                });
                            })
                            
                            
                        });

                    }else if(j==1){
                        let field = document.createElement("td");
                        field.textContent = expenseCost;
                        row.append(field);
                        let timeout;                    
                        field.addEventListener('click', ()=>{
                            let editCost = document.createElement("input");
                            field.textContent = " ";
                            editCost.setAttribute("type", "text");
                            editCost.setAttribute("value", expenseCost)
                            field.appendChild(editCost)
                            editCost.focus()
                            // editCost.addEventListener('blur')
                            // clearTimeout(timeout);
                            // timeout = setTimeout(function(){
                            //     if (editCost.value = expenseCost){
                            //         editCost.remove()
                            //         field.textContent = expenseCost
                            //     }
                            // },3000)
                            
                            editCost.addEventListener('click', event =>{
                                event.stopPropagation()
                            })
                            editCost.addEventListener('blur',()=>{
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
                                        document.getElementById("error-message").textContent = result.error
                                        let timeout;
                                        clearTimeout(timeout);
                                        timeout = setTimeout(function(){
                                            document.getElementById("error-message").textContent =" "
                                        },3000)
                                        
                                    }else{
                                        let newData = result.data
                                        editCost.remove();
                                        field.textContent = newData.expense_cost
                                    }
                                    
                                })
                        });
                        }); 
                    }else if (j==2){
                        let field = document.createElement("td");
                        let delBtn = document.createElement("button")
                        delBtn.textContent="delete"
                        field.appendChild(delBtn)
                        row.appendChild(field)
                    }
                }
                table.append(row)

            }
        }
    });
}

window.addEventListener("load", () => {
    let url = window.location.href
    budgetId = url.split("?")[1]

    getAllExpenses(budgetId);
    // addNewExpenses();
});
   