const express = require('express')
const Budget = require('../models/Budget')
const authMiddleware =  require('../middleware/authMiddleware');

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const categories = ["food", "travel", "shopping", "bills"];

        for (const category of categories) {
            const existingBudget = await Budget.findOne({
                category: category,
                user: req.userId,
            });

            if (!existingBudget) {
                await Budget.create({
                    category: category,
                    amount: 0,
                    user: req.userId,
                });
            } else if (!Number.isFinite(existingBudget.amount)) {
                existingBudget.amount = 0;
                await existingBudget.save();
            }
        }
        const budgets = await Budget.find({
            user: req.userId,
        });

        res.status(200).json(budgets);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch budgets",
        });
    }
});


router.put("/:category", authMiddleware, async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            {
                category: req.params.category,
                user: req.userId,
            },
            {
                amount: req.body.amount,
                category: req.params.category,
                user: req.userId,
            },
            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json(budget);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update budget",
        });
    }
});


module.exports = router;