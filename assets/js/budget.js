// create rows of data
createArticles = function(dataParams,articleHolder,budgetId,budgetTitle,article,indicator){
    let h3 = document.createElement("h3")
    for(let j=0; j< 3; j++){
        if (j==0){
            let span = document.createElement("span");
            h3.append(span)
            span.textContent = budgetTitle;
            span.addEventListener('click', ()=>{
                let editBox = document.createElement("input")
                span.textContent = " "
                editBox.setAttribute("type", "text")
                editBox.setAttribute("id", "edit-budget-title-input")
                span.appendChild(editBox)
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
                            span.textContent = budgetTitle
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
                                    span.textContent = budgetTitle
                                }else{
                                    let newData = result.data
                                    editBox.remove();
                                    span.textContent = newData.budget_title
                                }
                            })
                        }
                    });
                });
            });
            
        } else if (j==1){
            let span = document.createElement("span");
            span.setAttribute("id",budgetId)
            h3.append(span)
            article.append(h3)
            fetch(`http://127.0.0.1:5000/budgets/costs/${budgetId}`, dataParams)
            .then(response => response.json())
            .then(function(result){
                let oneData = result.data
                if(oneData[1] != null){
                    span.textContent = oneData[1].total
                }else{
                    span.textContent = oneData[0].total
                    

                }    
            })
            
        } else if (j==2){
            let delBtn = document.createElement("button")
            let openBtn = document.createElement("button")
            delBtn.textContent="delete"
            openBtn.textContent="open"
            article.appendChild(openBtn)
            article.appendChild(delBtn)
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
                    let delRow = document.getElementById("article-"+budgetId);
                    delRow.remove();
                });
            });
            openBtn.addEventListener('click', ()=> {
                let addNewExpenseBtn = document.getElementById("add-expense")
                let oldRows = document.querySelectorAll(`tr:not(#table-header)`);
                let titleField = document.getElementById("budget-title-header")
                let exTitle = document.getElementById("expense-title")
                let exCost = document.getElementById("expense-cost")
                let exClsbtn = document.getElementById("close-btn")

                titleField.textContent = budgetTitle + ": "
                let costField = document.getElementById("budget-cost-header")
                let cost = document.getElementById(`${budgetId}`)
                costField.textContent = cost.textContent
                for(let row of oldRows){
                    row.remove()
                }
                if (addNewExpenseBtn != null){
                    addNewExpenseBtn.remove();
                }
                if (exTitle != null && exCost != null && exClsbtn != null ){
                    exTitle.remove()
                    exCost.remove()
                    exClsbtn.remove()
                }

                return getAllExpenses(budgetId);
                           
            })
        }
        
    }
    let form = document.getElementById('budget-form')
    
    articleHolder.append(article);
    articleHolder.insertBefore(article,form);
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
        let articleHolder = document.getElementById("article-holder")
        if (result.data == null){
            return window.location.replace('http://localhost:8000/index.html')
        }else{
            for(let item of result.data){
                let budgetTitle = item.budget_title
                let budgetId = item.budget_id
                let article = document.createElement("article");
                article.setAttribute("id","article-"+budgetId)
                createArticles(dataParams,articleHolder,budgetId,budgetTitle,article,indicator=1)

                
            }
        }
        
    });
}

// add new budget to data base
addNewBudget = function(){
    let addNewBudgetBtn = document.getElementById("add-budget");
    let form = document.getElementById("budget-form")
    addNewBudgetBtn.addEventListener("click", () => {
        if ( addNewBudgetBtn.textContent == "New"){
            let input = document.createElement("input")
            let clsbtn = document.createElement("button")
            clsbtn.textContent = "close"
            input.setAttribute("type","text")
            input.setAttribute("id","new-budget-input")
            input.setAttribute("placeholder", "enter budget title")
            clsbtn.setAttribute("id","close-btn")
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
            let budgetTitleInput = document.getElementById("new-budget-input")
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
        let articleHolder = document.getElementById("article-holder")
        if (result.data == null){
            return window.location.replace('http://localhost:8000/index.html');
        }else{
            let item = result.data;
            let budgetId = item.budget_id;
            let budgetTitle = item.budget_title;
            let article = document.createElement("article");
            article.setAttribute("id","article-"+budgetId)
            createArticles(dataParams,articleHolder,budgetId,budgetTitle,article,indicator=1)
        }
    });
}


window.addEventListener("load", () => {
    getAllbudgets();
    addNewBudget();
    getTotalBudgetCost();
});

function getTotalBudgetCost(){
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch('http://127.0.0.1:5000/budgets/costs', dataParams)
    .then(response => response.json())
    .then(function(result){
        let total = result.data.pop()
        document.getElementById('total-cost').textContent = total.total

    })
}

function getIndividualBudgetCost(budgetId){
    let span = document.getElementById(budgetId)
    let costField = document.getElementById("budget-cost-header")
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch(`http://127.0.0.1:5000/budgets/costs/${budgetId}`, dataParams)
    .then(response => response.json())
    .then(function(result){
        let oneData = result.data
        if(oneData[1] != null){
            span.textContent = oneData[1].total
            costField.textContent = oneData[1].total
        }else{
            span.textContent = oneData[0].total
            costField.textContent = oneData[0].total
        }    
    })
    
    
}
    

function errorMessage(message){
    document.getElementById("error-message").textContent = message
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function(){
        document.getElementById("error-message").textContent =" "
    },3000)
}