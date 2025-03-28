// Load initial data from localStorage or set an empty array
let loans = JSON.parse(localStorage.getItem("loans")) || [];

// Save loans to localStorage
function saveLoans() {
    localStorage.setItem("loans", JSON.stringify(loans));
}

// Add new loan
function addLoan() {
    const loanName = document.getElementById("loanName").value;
    const initialAmount = parseFloat(document.getElementById("initialAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value);

    if (!loanName || isNaN(initialAmount) || isNaN(interestRate) || initialAmount <= 0 || interestRate <= 0) {
        alert("Please enter valid loan details.");
        return;
    }

    // Create loan object
    const newLoan = {
        id: Date.now(),
        name: loanName,
        balance: initialAmount,
        interestRate: interestRate,
        lastUpdate: new Date().toISOString().split('T')[0],
        log: []
    };

    // Add new loan and save
    loans.push(newLoan);
    saveLoans();
    renderLoans();
}

// Calculate daily interest
function calculateDailyInterest(balance, rate) {
    return (balance * (rate / 100)) / 365;
}

// Update loan balances daily
// Update loan balances daily with interest accumulation
function updateLoanBalances() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD
    loans.forEach((loan) => {
        const lastUpdateDate = new Date(loan.lastUpdate);
        const currentDate = new Date();
        
        // Calculate number of days since last update
        const daysDiff = Math.floor((currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24));

        // Only apply interest if days have passed
        if (daysDiff > 0) {
            const dailyInterest = calculateDailyInterest(loan.balance, loan.interestRate);

            // Apply interest for each day that has passed
            const interestAmount = dailyInterest * daysDiff;
            loan.balance += interestAmount;

            // Log the interest applied
            loan.log.push(`Interest of $${interestAmount.toFixed(2)} added over ${daysDiff} days.`);

            // Update the last update date to today
            loan.lastUpdate = today;
        }
    });

    // Save updated data to localStorage
    saveLoans();
}


// Update and render all loans
function renderLoans() {
    updateLoanBalances();
    const loanList = document.getElementById("loanList");
    loanList.innerHTML = "";

    loans.forEach((loan) => {
        const li = document.createElement("li");
        li.className = "loan-item";
        li.innerHTML = `
            <h3>${loan.name}</h3>
            <p><strong>Balance:</strong> $${loan.balance.toFixed(2)}</p>
            <p><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
            <p><strong>Last Updated:</strong> ${loan.lastUpdate}</p>
            <div class="loan-actions">
                <button onclick="makePayment(${loan.id})">Make Payment</button>
                <button onclick="deleteLoan(${loan.id})">Delete Loan</button>
            </div>
        `;
        loanList.appendChild(li);
    });
}

// Make payment for a loan
function makePayment(id) {
    const amount = parseFloat(prompt("Enter payment amount:"));
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const loan = loans.find((l) => l.id === id);
    if (loan) {
        loan.balance -= amount;
        loan.log.push(`Payment of $${amount.toFixed(2)} made on ${loan.lastUpdate}`);
        saveLoans();
        renderLoans();
    }
}

// Delete a loan
function deleteLoan(id) {
    loans = loans.filter((loan) => loan.id !== id);
    saveLoans();
    renderLoans();
}

// Auto-update balances every 24 hours
function autoUpdateDaily() {
    setInterval(updateLoanBalances, 24 * 60 * 60 * 1000);
}
function calculateDailyInterest(balance, rate) {
    return (balance * (rate / 100)) / 365;
}
// Initial render and start 24-hour auto update
renderLoans();
updateLoanBalances();
autoUpdateDaily();
