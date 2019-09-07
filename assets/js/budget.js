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
                // console.log(item)
                let row = document.createElement("tr");
                row.setAttribute("id","row-"+item.budget_id)
                for(let j=0; j<3; j++){
                    if (j==0){
                        let field = document.createElement("td");
                        field.textContent = item.budget_title
                        row.append(field)
                        let timeout;                    
                        field.addEventListener('click', ()=>{
                            let editBox = document.createElement("input")
                            field.textContent = " "
                            editBox.setAttribute("type", "text")
                            editBox.setAttribute("value", item.budget_title)
                            field.appendChild(editBox)
                            editBox.focus()
                            clearTimeout(timeout);
                            timeout = setTimeout(function(){
                                if (editBox.value = item.budget_title){
                                    editBox.remove()
                                    field.textContent = item.budget_title
                                }
                            },5000)
                            
                            editBox.addEventListener('click', event =>{
                                event.stopPropagation()
                                
                            })
                            editBox.addEventListener('input',()=>{
                                clearTimeout(timeout);
                                timeout = setTimeout(function(){
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
                                    fetch(`http://127.0.0.1:5000/budget/${item.budget_id}`, dataParams)
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
                                            field.textContent = newData.budget_title
                                        }
                                        
                                    })
                                } , 6000);
                               
                            })
                        })
                        
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
        }
        
    });
}

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
                    document.getElementById("error-message").textContent = result.error
                    let timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(function(){
                        document.getElementById("error-message").textContent =" "
                    },3000)
                }else{
                    newlyAddedBudget = result.data
                    addNewBudgetBtn.textContent = "New"
                    budgetTitleInput.remove();
                    clsbtn.remove()
                    getSinglebudget(newlyAddedBudget.budget_id);
                }
               
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
                let timeout;                    
                field.addEventListener('click', ()=>{
                    let editBox = document.createElement("input")
                    field.textContent = " "
                    editBox.setAttribute("type", "text")
                    editBox.setAttribute("value", budgetTitle)
                    field.appendChild(editBox)
                    editBox.focus()
                    clearTimeout(timeout);
                    timeout = setTimeout(function(){
                        if (editBox.value = budgetTitle){
                            editBox.remove()
                            field.textContent = budgetTitle
                        }
                    },4000)
                    
                    editBox.addEventListener('click', event =>{
                        event.stopPropagation()
                        
                    })
                    editBox.addEventListener('input',()=>{
                        clearTimeout(timeout);
                        timeout = setTimeout(function(){
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
                                let newData = result.data
                                editBox.remove();
                                field.textContent = newData.budget_title
                            })
                        } , 6000);
                        
                    })
                })
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