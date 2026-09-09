const express = require('express');
const Income = require('../models/Income');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {

    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }
    const income = await Income.create({
      amount,
      user: req.userId,
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create Income"
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const income = await Income.findOne({
      user: req.userId,
    });

    res.status(200).json(income);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch Income"
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const income = await Income.findOneAndUpdate(
      { user: req.userId },
      {
        amount,
        user: req.userId,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(income);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update income",
    });
  }
});

module.exports = router;