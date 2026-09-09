const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const expenseRoute = require("./routes/expenseRoute")
const incomeRoute = require("./routes/incomeRoute")
const userRoute = require("./routes/userRoute")
const budgetRoute = require("./routes/budgetRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/income", incomeRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/users", userRoute);
app.use("/api/budgets", budgetRoute);

app.get("/", (req, res) => {
    res.send("Finora backend is running");
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDb connected");

        app.listen(5000, () => {
        console.log("Server running on port 5000");
        });
    })
    .catch((error) => {
        console.error("MondoDB connection failed:", error.message);
    });