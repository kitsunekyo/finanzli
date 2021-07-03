import mongoose from "mongoose";
import express from "express";

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        deductiblePercent: {
            type: Number,
            default: 100,
        },
        fileUri: {
            type: String,
        },
        tags: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

const router = express.Router();

router.get("/", async (req, res) => {
    const expenses = await Expense.find({});
    res.json(expenses);
});

router.post("/", async (req, res) => {
    const expense = new Expense(req.body);
    await expense.save();
    res.json(expense);
});

export { router };
