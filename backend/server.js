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

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MondoDB connection failed:", error.message);
    });