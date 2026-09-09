const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;