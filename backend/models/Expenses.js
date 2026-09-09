const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
    },
    category :{
        type: String,
        required: true,
    },
    amount :{
        type: Number,
        required: true,
    },
    date :{
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
},{ timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;