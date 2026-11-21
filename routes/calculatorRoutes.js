
const express = require("express");

const router = express.Router();

const {
    calculate,
    getHistory,
    clearHistory
} = require("../controllers/calculatorController");

// Calculate expression
router.post("/calculate", calculate);

// Get calculation history
router.get("/history", getHistory);

// Delete calculation history
router.delete("/history", clearHistory);

module.exports = router;
