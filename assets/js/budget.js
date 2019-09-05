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
        for(let item of result.data){
            console.log(item)
            let row = document.createElement("tr");
            row.setAttribute("id","row-"+item.budget_id)
            for(let j=0; j<3; j++){
                if (j==0){
                    let field = document.createElement("td");
                    field.textContent = item.budget_title
                    field.setAttribute("id","title-field"+item.budgetId)
                    let titleField = document.getElementById("title-field"+item.budgetId)
                    titleField.addEventListener('click', ()=>{
                        field.textContent = " "
                    })
                    row.append(field)
                } else if (j==1){
                    let field = document.createElement("td");
                    field.textContent = item.budget_id
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
                        fetch(`http://127.0.0.1:5000/budget/${item.budget_id}`, dataParams)
                        .then(response => response.json())
                        .then(function(result){
                            console.log(result.data)
                        });
                        let delRow = document.getElementById("row-"+item.budget_id);
                        delRow.remove();
                    });

                    openBtn.addEventListener('click', ()=> {
                        return window.location.replace('http://localhost:8000/expense.html')
                    })
                }
                
            }
            table.append(row);
        }
        
    });
}

addNewBudget = function(){
    let addNewBudgetBtn = document.getElementById("add-budget");
    
    addNewBudgetBtn.addEventListener("click", () => {

        if ( addNewBudgetBtn.textContent == "New"){
            let input = document.createElement("input")
            let form = document.getElementById("add-budget-form")
            input.setAttribute("type","text")
            input.setAttribute("id","budget-title")
            form.appendChild(input)
            addNewBudgetBtn.textContent = "Save"
        } else if ( addNewBudgetBtn.textContent == "Save"){
            budgetTitleInput = document.getElementById("budget-title")
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
                newlyAddedBudget = result.data
                addNewBudgetBtn.textContent = "New"
                budgetTitleInput.remove();
                getSinglebudget(newlyAddedBudget.budget_id);
            })
            
        }

        

    });
}

getSinglebudget = function(newBudgetId){
    let dataParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch(`http://127.0.0.1:5000/budget/${newBudgetId}`, dataParams)
    .then(response => response.json())
    .then(function(result){
        let table = document.getElementsByTagName("table")[0];
        let singleBudget = result.data;
        let budgetId = singleBudget.budget_id;
        let budgetTitle = singleBudget.budget_title;
        let row = document.createElement("tr");
        row.setAttribute("id","row-"+budgetId)
        for(let j=0; j<3; j++){
            if (j==0){
                let field = document.createElement("td");
                field.textContent = budgetTitle
                row.append(field)
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
                        console.log(result.data)
                    });
                    let delRow = document.getElementById("row-"+budgetId);
                    delRow.remove();
                });
            }
            
        }
        table.append(row);
        
        
    });
}



window.addEventListener("load", () => {
    getAllbudgets();
    addNewBudget();
});
    
    
   
    




































// let addNewButton = document.getElementById("add-new")

// addNewButton.addEventListener("click", () => {
//     let table = document.getElementsByTagName("table")[0]
//     let row = document.createElement("tr");
    
//     for(let j=0; j<3; j++){
//         let field = document.createElement("td");
//         row.append(field)
//         if(j ==2 ){
//             let delBtn = document.createElement("button")
//             let openBtn = document.createElement("button")
//             delBtn.textContent="delete"
//             openBtn.textContent="open"
//             field.append(delBtn)
//             field.append(openBtn)
//         }
//     }
//     table.append(row)
// })