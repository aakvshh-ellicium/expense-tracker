const formEl = document.getElementById('inputForm')
const expenseEl = document.querySelectorAll('button')


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

console.log(state)

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
        const {description, category, amount, date, type} = transaction;
        let sign = type === "credit" ? "+" : "-";

        displayTransactions.insertAdjacentHTML('beforeend',
        `   <div class="card">
                <div class="cardHeader">
                    <p id="displayText">${description}</p>
                    <div id="category">
                        <i class="fa-solid fa-square" id="expenseIcon"></i>
                        <p class="categoryName">${category}</p><br>                                            
                    </div>
                </div>
                <p id="displayAmount">${sign} ${amount}</p>
                <p class="categoryName">${date}</p>
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

    const formData = new FormData(formEl);
    console.log(e)

    const transactionData = {}

    formData.forEach((value, key) => transactionData[key] = value);

    const {description, amount, date, category} = transactionData;
    const isEarn = e.submitter.id === "earningsButton" ? "credit" : "debit";

    const transaction = {
        description,
        amount,
        date,
        category,
        type: isEarn
    }

    state.transactions.push(transaction)

    console.log(state)
    
    updateState();
    setLocalStorage();
    readtransactions();
}

formEl.addEventListener('submit', addTransaction);


