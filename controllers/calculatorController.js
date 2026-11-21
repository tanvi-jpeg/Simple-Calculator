
const Calculation = require("../models/Calculation");
const { parse } = require("mathjs");

// Safely evaluate basic mathematical expressions
function evaluateExpression(expression) {

    if (typeof expression !== "string") {
        throw new Error("Expression must be text");
    }

    expression = expression.trim();

    if (!expression || expression.length > 120) {
        throw new Error("Invalid expression length");
    }

    // Only allow mathematical characters
    if (!/^[0-9+\-*/%.()^\s]+$/.test(expression)) {
        throw new Error("Invalid characters in expression");
    }

    const tree = parse(expression);

    // Allow only numbers, parentheses and arithmetic operators
    tree.traverse((node) => {

        if (node.isConstantNode) {
            if (typeof node.value !== "number") {
                throw new Error("Only numbers are allowed");
            }
        }

        else if (node.isParenthesisNode) {
            return;
        }

        else if (node.isOperatorNode) {

            const allowedOperators = [
                "+", "-", "*", "/", "%", "^"
            ];

            if (!allowedOperators.includes(node.op)) {
                throw new Error("Unsupported operator");
            }
        }

        else {
            throw new Error("Invalid mathematical expression");
        }

    });

    const result = tree.evaluate();

    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Invalid calculation result");
    }

    return Number(result.toPrecision(12));
}


// POST: Calculate and save
exports.calculate = async (req, res) => {

    try {

        const { expression } = req.body;

        const result = evaluateExpression(expression);

        const calculation = await Calculation.create({
            expression,
            result: String(result)
        });

        res.status(201).json({
            success: true,
            result,
            calculation
        });

    }

    catch (error) {

        res.status(400).json({
            success: false,
            error: error.message
        });

    }

};


// GET: Retrieve history
exports.getHistory = async (req, res) => {

    try {

        const history = await Calculation.find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(history);

    }

    catch (error) {

        res.status(500).json({
            success: false,
            error: "Could not retrieve history"
        });

    }

};


// DELETE: Clear history
exports.clearHistory = async (req, res) => {

    try {

        await Calculation.deleteMany({});

        res.json({
            success: true,
            message: "Calculation history cleared"
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            error: "Could not clear history"
        });

    }

};
