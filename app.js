// DOM Elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const addExpenseButton = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');

// Expense array
let expenses = [];

// Chart.js instance
let chart;

// Load from localStorage
window.onload = function () {
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
        renderExpenses();
        updateChart();
        calculateTotal();
    }
};

// Event listener for adding an expense
addExpenseButton.addEventListener('click', function () {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const category = categoryInput.value;

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please provide a valid description and amount.');
        return;
    }

    const expense = {
        id: Date.now(),
        description: description,
        amount: amount,
        category: category
    };

    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    calculateTotal();
    updateChart();

    descriptionInput.value = '';
    amountInput.value = '';
});

// Function to render expenses
function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'expense-item list-group-item';
        li.innerHTML = `
            <span>
                ${expense.description} - <span class="expense-category">${expense.category}</span> 
            </span>
            <span>$${expense.amount.toFixed(2)}
                <button class="btn btn-sm btn-danger ms-3" onclick="deleteExpense(${expense.id})">Delete</button>
            </span>
        `;
        expenseList.appendChild(li);
    });
}

// Calculate the total expense
function calculateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total.toFixed(2);
}

// Function to delete an expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    renderExpenses();
    calculateTotal();
    updateChart();
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Update the chart
function updateChart() {
    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
    };

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('expense-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: data,
    });
}
