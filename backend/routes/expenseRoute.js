const express = require("express");
const Expense = require("../models/Expenses");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const expense = await Expense.create({
      ...req.body,
      amount,
      user: req.userId,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create expense",
      error: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.userId,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const expense = await Expense.findByIdAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        ...req.body,
        amount,
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update expense",
    });
  }
});

module.exports = router;