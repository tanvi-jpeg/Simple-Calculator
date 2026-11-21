
// ========================================
// DOM ELEMENTS
// ========================================

const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const historyList = document.getElementById("historyList");

const historySearch = document.getElementById("historySearch");
const clearSearch = document.getElementById("clearSearch");
const clearHistory = document.getElementById("clearHistory");
const themeBtn = document.getElementById("themeBtn");


// ========================================
// GLOBAL VARIABLES
// ========================================

let expression = "";
let justCalculated = false;
let allHistory = [];


// ========================================
// UPDATE DISPLAY
// ========================================

function updateDisplay() {
    expressionDisplay.textContent = expression || "0";
}


// ========================================
// BUTTON INPUT
// ========================================

document.querySelector(".buttons").addEventListener("click", (event) => {

    const button = event.target.closest("button");

    if (!button) return;

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
        clearCalculator();
    }

    else if (action === "delete") {
        expression = expression.slice(0, -1);
        justCalculated = false;
        resultDisplay.textContent = "0";
    }

    else if (action === "bracket") {
        addBracket();
    }

    else if (action === "calculate") {
        performCalculation();
    }

    else if (value === "%") {
        applyPercentage();
    }

    else if (value) {
        appendValue(value);
    }

    updateDisplay();

});


// ========================================
// APPEND VALUE
// ========================================

function appendValue(value) {

    if (justCalculated) {

        if (/[0-9.]/.test(value)) {
            expression = "";
        }

        justCalculated = false;
    }

    if (expression.length >= 120) return;

    const operators = ["+", "-", "*", "/"];
    const lastChar = expression.slice(-1);

    if (operators.includes(value)) {

        if (!expression && value !== "-") return;

        if (operators.includes(lastChar)) {
            expression = expression.slice(0, -1);
        }
    }

    if (value === ".") {

        const currentNumber = expression.split(/[+\-*/()]/).pop();

        if (currentNumber.includes(".")) return;
    }

    expression += value;
}


// ========================================
// BRACKETS
// ========================================

function addBracket() {

    if (expression.length >= 120) return;

    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    if (openCount > closeCount && /[\d)]$/.test(expression)) {

        expression += ")";

    } else {

        if (/[0-9)]$/.test(expression)) {
            expression += "*";
        }

        expression += "(";
    }

    justCalculated = false;
}


// ========================================
// PERCENTAGE
// ========================================

function applyPercentage() {

    const match = expression.match(/(\d*\.?\d+)$/);

    if (!match) return;

    const number = match[0];

    expression = expression.slice(0, -number.length)
        + "(" + number + "/100)";

    justCalculated = false;
}


// ========================================
// CLEAR CALCULATOR
// ========================================

function clearCalculator() {

    expression = "";
    resultDisplay.textContent = "0";
    justCalculated = false;

    updateDisplay();
}


// ========================================
// PERFORM CALCULATION
// ========================================

async function performCalculation() {

    if (!expression.trim()) return;

    const currentExpression = expression;

    try {

        resultDisplay.textContent = "Calculating...";

        const response = await fetch("/api/calculate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                expression: currentExpression
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation failed");
        }

        resultDisplay.textContent = data.result;

        expression = String(data.result);
        justCalculated = true;

        // Refresh history after saving
        await loadHistory();

    }

    catch (error) {

        resultDisplay.textContent = "Error";
        console.error("Calculation error:", error);

    }
}


// ========================================
// LOAD HISTORY FROM MONGODB
// ========================================

async function loadHistory() {

    try {

        const response = await fetch("/api/history");

        if (!response.ok) {
            throw new Error("Could not load history");
        }

        // Store all retrieved calculations
        allHistory = await response.json();

        // Display history according to search
        filterHistory();

    }

    catch (error) {

        console.error("History loading error:", error);

    }
}


// ========================================
// SEARCH HISTORY
// ========================================

function filterHistory() {

    const query = historySearch
        ? historySearch.value.trim().toLowerCase()
        : "";

    // Show or hide clear search button
    if (historySearch) {

        historySearch.parentElement.classList.toggle(
            "has-value",
            query.length > 0
        );

    }

    // Search only inside the original expression
    const filteredHistory = allHistory.filter(item => {

        const calculation = String(item.expression).toLowerCase();

        return calculation.includes(query);

    });

    // No matching calculations
    if (query && filteredHistory.length === 0) {

        historyList.innerHTML = `
            <div class="no-search-results">
                <div class="empty-icon">⌕</div>
                <h4>No matching calculations</h4>
                <p>No calculation contains "${query}".</p>
            </div>
        `;

    } else {

        renderHistory(filteredHistory);

    }
}


// ========================================
// DISPLAY CALCULATION HISTORY
// ========================================

function renderHistory(history) {

    historyList.innerHTML = "";

  if (history.length === 0) {
        historyList.innerHTML = `
            <p class="empty">No calculations yet.</p>
        `;
        return;
    }

    history.forEach(item => {

        const historyItem = document.createElement("div");
        historyItem.className = "history-item";

        // Original expression
        const exp = document.createElement("div");
        exp.className = "history-expression";
        exp.textContent = item.expression;

        // Calculation result
        const result = document.createElement("div");
        result.className = "history-result";
        result.textContent = "= " + item.result;

        // Calculation date
        const date = document.createElement("div");
        date.className = "history-date";
        date.textContent = new Date(item.createdAt).toLocaleString();

        historyItem.append(exp, result, date);

        // Restore calculation when clicked
        historyItem.addEventListener("click", () => {

            expression = item.expression;
            resultDisplay.textContent = item.result;

            justCalculated = false;

            updateDisplay();

        });

        historyList.appendChild(historyItem);

    });

}


// ========================================
// SEARCH EVENT LISTENERS
// ========================================

if (historySearch) {

    historySearch.addEventListener("input", filterHistory);

}

if (clearSearch) {

    clearSearch.addEventListener("click", () => {

        historySearch.value = "";

        filterHistory();

        historySearch.focus();

    });

}


// ========================================
// CLEAR ALL HISTORY
// ========================================

document.getElementById("clearHistory").addEventListener("click", async () => {

    try {

        const response = await fetch("/api/history", {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not clear history");
        }

        loadHistory();

    }

    catch (error) {
        console.error(error);
    }

});


// ========================================
// THEME TOGGLE
// ========================================

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light");

        const isLight = document.body.classList.contains("light");

        themeBtn.textContent = isLight ? "☾" : "☀";

    });

}


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", (event) => {

    // Allow normal typing inside search input
    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        appendValue(key);
    }

    else if (["+", "-", "*", "/"].includes(key)) {
        appendValue(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        performCalculation();
    }

    else if (key === "Backspace") {
        expression = expression.slice(0, -1);
        justCalculated = false;
        resultDisplay.textContent = "0";
    }

    else if (key === "Escape") {
        clearCalculator();
    }

    else if (key === "(" || key === ")") {
        addBracket();
    }

    else if (key === "%") {
        applyPercentage();
    }

    updateDisplay();

});


// ========================================
// INITIALIZE APPLICATION
// ========================================

updateDisplay();
loadHistory();
