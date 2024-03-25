const formEl = document.getElementById('inputForm')
const expenseEl = document.querySelectorAll('button')
let net = 0;
let earnings = 0;
let expenses = 0;

const state = {
    earnings: earnings,
    expenses: expenses,
    net: net,
    transactions: []
    
}

function readtransactions(){
    const displayTransactions = document.querySelector('.cards');
    let transactions = document.createElement('div').innerHTML;
    
    indexToFetch = state.transactions.length - 1;
    
    let text = state.transactions[indexToFetch].description;
    let category = state.transactions[indexToFetch].category;
    let amount = state.transactions[indexToFetch].amount;
    let date = state.transactions[indexToFetch].date;

    
    const netEarnings = document.getElementById('netEarnings')



    let sign = state.transactions[indexToFetch].type == "credit" ? "+" : "-";

    // newTransaction = transactions.innerHTML;
    transactions += `  <div class="card">
                                    <div class="cardHeader">
                                        <p id="displayText">${text}</p>
                                        <div id="category">
                                            <i class="fa-solid fa-square" id="expenseIcon"></i>
                                            <p class="categoryName">${category}</p><br>
                                            
                                            
                                        </div>
                                    </div>
                                    <p id="displayAmount">${sign} ${amount}</p>
                                    <p class="categoryName">${date}</p>
                                </div>`
    
    state.transactions[indexToFetch].type == "credit" ? earnings += Number(amount) : expenses += Number(amount);
    net = earnings - expenses

    
    netEarnings.innerHTML = `${net} Rs`
    // console.log(earnings)
    // console.log(expenses)
    // console.log(net)
    // transactions.innerHTML = transactions
    displayTransactions.insertAdjacentHTML('beforeend',transactions);


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
        description: description,
        amount: amount,
        date: date,
        category: category,
        type: isEarn
    }

    state.transactions.push(transaction)

    console.log(state.transactions)
    
    
    readtransactions();

    // state.net = net;

}

formEl.addEventListener('submit', addTransaction);


