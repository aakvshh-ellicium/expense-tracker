
const formEl = document.getElementById('inputForm')
const expenseEl = document.querySelectorAll('button')
const updateEl = document.getElementById('edit')
const deleteEl = document.getElementById('delete')
const dropdown = document.querySelectorAll('#categories');
console.log(dropdown[0])
const ascendingOption = document.getElementById('ascending')
// console.log(ascendingOption)
const amountOption = document.getElementById('amount')

let tid;
let isExist = false;

let state = {
    earnings: 0,
    expenses: 0,
    net: 0,
    transactions: []
    
}
const savedState = JSON.parse(localStorage.getItem("state"))
if (savedState) {
    state = savedState; 
    readtransactions();
}


function setLocalStorage(){
    localStorage.setItem("state", JSON.stringify(state));
}


function updateState() {
    state.earnings = 0;
    state.expenses = 0;
    state.net = 0;
    state.transactions.forEach(transaction => {
        if (transaction.type == 'credit'){
            state.earnings += Number(transaction.amount)
        } else {
            state.expenses += Number(transaction.amount)
        }
    })

    state.net = state.earnings - state.expenses;
}

function readtransactions(){
    const displayTransactions = document.querySelector('.cards');
    displayTransactions.innerHTML = ""
    let net = 0;

    state.transactions.forEach(transaction => {
        const {description, category, amount, date, type, id} = transaction;
        let sign = type === "credit" ? "+" : "-";

        displayTransactions.insertAdjacentHTML('beforeend',
        `   <div class="card" id=${id}>
                <div class="cardHeader">
                    <p id="displayText">${description}</p>
                    <div id="category">
                        <i class="fa-solid fa-square" id="expenseIcon"></i>
                        <p class="categoryName">${category}</p><br>                                            
                    </div>
                </div>
                <p id="displayAmount">${sign} ${amount}</p>
                <p class="categoryName">${date}</p>
                <div style="text-align: right;">
                    <i id="edit" onclick="updateTransaction(this)" class="fa-regular fa-pen-to-square"></i>
                    <i id="delete" onclick="deleteTransaction(this)" class="fa-solid fa-trash"></i>
                </div>
            </div>`
        )
        
        type === "credit" ? net += Number(amount) : net -= Number(amount);
    })

    setLocalStorage();

    const netEarnings = document.getElementById('netEarnings')
    netEarnings.innerHTML = `${net} Rs`
}


const addTransaction = (e) => {
    e.preventDefault();

    let amountInput = document.getElementById('amount') 
    let textInput = document.getElementById('text')
    let dateInput = document.getElementById('date')
    let categoryInput = document.getElementById('categories')

    const formData = new FormData(formEl);
    console.log(e)

    const transactionData = {}

    formData.forEach((value, key) => transactionData[key] = value);

    const {description, amount, date, category} = transactionData;
    const isEarn = e.submitter.id === "earningsButton" ? "credit" : "debit";

    const transaction = {
        id: isExist ? tid : Math.floor(Math.random() * 100),
        description,
        amount,
        date,
        category,
        type: isEarn
    }

    if (isExist){
        const tIndex = state.transactions.findIndex(t => t.id == tid)

        state.transactions[tIndex] = transaction;
        isExist = false;
        tid = 0;
    } else {
        state.transactions.push(transaction)
    }


    console.log(state);
    amountInput.value = ""
    textInput.value = ""
    dateInput.value = ""
    categoryInput.value = "Bill-Payment";
    
    updateState();
    setLocalStorage();
    readtransactions();
}

const updateTransaction = (e) => {
    // console.log('first')
    const amount = e.parentElement.previousElementSibling.previousElementSibling.textContent.replace("+", "").replace("-", "");
    const text = e.parentElement.parentElement.firstElementChild.firstElementChild.textContent;
    const date = e.parentElement.previousElementSibling.textContent
    const category = e.parentElement.parentElement.firstElementChild.lastElementChild.lastElementChild.previousElementSibling.textContent
    let amountInput = document.getElementById('amount') 
    let textInput = document.getElementById('text')
    let dateInput = document.getElementById('date')
    let categoryInput = document.getElementById('categories')
    
    amountInput.value = parseInt(amount);
    textInput.value = text;
    dateInput.value = date;
    categoryInput.value = category
    
    const id = e.parentElement.parentElement.id
    tid = Number(id)
    isExist = true;
    
}

const deleteTransaction = (e) => {
    const deleteTransactionId = e.parentElement.parentElement.id;
    const filteredTransaction = state.transactions.filter(t => t.id != deleteTransactionId)
    // console.log(filteredTransaction)

    state.transactions = filteredTransaction
    readtransactions();
    // console.log(e.parentElement.id)
}

const sortAscending = () => {
    const sortTransactionsAsc = state.transactions.sort((a,b) => a.amount - b.amount);

    const displayTransactions = document.querySelector('.cards');
    displayTransactions.innerHTML = "";
    let net = 0;
    sortTransactionsAsc.forEach(transaction => {
        const {description, category, amount, date, type, id} = transaction;
        let sign = type === "credit" ? "+" : "-";

        displayTransactions.insertAdjacentHTML('beforeend',
        `   <div class="card" id=${id}>
                <div class="cardHeader">
                    <p id="displayText">${description}</p>
                    <div id="category">
                        <i class="fa-solid fa-square" id="expenseIcon"></i>
                        <p class="categoryName">${category}</p><br>                                            
                    </div>
                </div>
                <p id="displayAmount">${sign} ${amount}</p>
                <p class="categoryName">${date}</p>
                <div style="text-align: right;">
                <i id="edit" onclick="updateTransaction(this)" class="fa-regular fa-pen-to-square"></i>
                <i id="delete" onclick="deleteTransaction(this)" class="fa-solid fa-trash"></i>
                </div>
            </div>`
        )
        
        type === "credit" ? net += Number(amount) : net -= Number(amount);
    })
    console.log(sortTransactionsAsc);
}

const sortDescending = () => {
    const sortTransactionsDesc = state.transactions.sort((a,b) => b.amount - a.amount);

    const displayTransactions = document.querySelector('.cards');
    displayTransactions.innerHTML = "";
    let net = 0;
    sortTransactionsDesc.forEach(transaction => {
        const {description, category, amount, date, type, id} = transaction;
        let sign = type === "credit" ? "+" : "-";

        displayTransactions.insertAdjacentHTML('beforeend',
        `   <div class="card" id=${id}>
                <div class="cardHeader">
                    <p id="displayText">${description}</p>
                    <div id="category">
                        <i class="fa-solid fa-square" id="expenseIcon"></i>
                        <p class="categoryName">${category}</p><br>                                            
                    </div>
                </div>
                <p id="displayAmount">${sign} ${amount}</p>
                <p class="categoryName">${date}</p>
                <div style="text-align: right;">
                <i id="edit" onclick="updateTransaction(this)" class="fa-regular fa-pen-to-square"></i>
                <i id="delete" onclick="deleteTransaction(this)" class="fa-solid fa-trash"></i>
                </div>
            </div>`
        )
        
        type === "credit" ? net += Number(amount) : net -= Number(amount);
    })
    console.log(sortTransactionsDesc);
}

const sortAscendingDate = () => {
    const sortTransactionsAsc = state.transactions.sort((a,b) => new Date(a.date) - new Date(b.date));

    const displayTransactions = document.querySelector('.cards');
    displayTransactions.innerHTML = "";
    let net = 0;
    sortTransactionsAsc.forEach(transaction => {
        const {description, category, amount, date, type, id} = transaction;
        let sign = type === "credit" ? "+" : "-";

        displayTransactions.insertAdjacentHTML('beforeend',
        `   <div class="card" id=${id}>
                <div class="cardHeader">
                    <p id="displayText">${description}</p>
                    <div id="category">
                        <i class="fa-solid fa-square" id="expenseIcon"></i>
                        <p class="categoryName">${category}</p><br>                                            
                    </div>
                </div>
                <p id="displayAmount">${sign} ${amount}</p>
                <p class="categoryName">${date}</p>
                <div style="text-align: right;">
                <i id="edit" onclick="updateTransaction(this)" class="fa-regular fa-pen-to-square"></i>
                <i id="delete" onclick="deleteTransaction(this)" class="fa-solid fa-trash"></i>
                </div>
            </div>`
        )
        
        type === "credit" ? net += Number(amount) : net -= Number(amount);
    })

}

const sortDescendingDate = () => {
    const sortTransactionsDesc = state.transactions.sort((a,b) => new Date(b.date) - new Date(a.date));

    const displayTransactions = document.querySelector('.cards');
    displayTransactions.innerHTML = "";
    let net = 0;
    sortTransactionsDesc.forEach(transaction => {
        const {description, category, amount, date, type, id} = transaction;
        let sign = type === "credit" ? "+" : "-";

        displayTransactions.insertAdjacentHTML('beforeend',
        `   <div class="card" id=${id}>
                <div class="cardHeader">
                    <p id="displayText">${description}</p>
                    <div id="category">
                        <i class="fa-solid fa-square" id="expenseIcon"></i>
                        <p class="categoryName">${category}</p><br>                                            
                    </div>
                </div>
                <p id="displayAmount">${sign} ${amount}</p>
                <p class="categoryName">${date}</p>
                <div style="text-align: right;">
                <i id="edit" onclick="updateTransaction(this)" class="fa-regular fa-pen-to-square"></i>
                <i id="delete" onclick="deleteTransaction(this)" class="fa-solid fa-trash"></i>
                </div>
            </div>`
        )
        
        type === "credit" ? net += Number(amount) : net -= Number(amount);
    })
    
}

const sortByCategory = (e) => {
    console.log(e)
    if (e === 'amount-descending'){
        sortDescending();
    } else if (e === 'amount-ascending'){
        sortAscending();
    } else if (e === 'date-latest'){
        sortDescendingDate();
    } else if (e === 'date-oldest'){
        sortAscendingDate();
    }
}

formEl.addEventListener('submit', addTransaction);





