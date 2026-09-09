import SummaryCard from "../components/Dashboard/SummaryCard";
import RecentExpenses from "../components/Dashboard/RecentExpenses";
import SpendingChart from "../components/Dashboard/SpendingChart";
import { useMemo, useState } from "react";
import AddExpenseDialog from "@/components/Expenses/AddExpenseDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function Dashboard({expenses, handleAddExpense, income, setIncome, theme, setToken, user, setUser}) {

  const [incomeInput, setIncomeInput] = useState("");
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [incomeError, setIncomeError] = useState("");


  const handleAddIncome = async () => {
    const amount = Number(incomeInput);
    if(amount <=0){
      return;
    }

    if (!incomeInput || amount <= 0) {
      setIncomeError("Amount must be greater than 0.");
      return;
    }

    try{
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/income",{
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: income + amount,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok){
        throw new Error("Failed to add income");
      }
      const data = await response.json();
      setIncome(data.amount);
      setIncomeInput("");
      setIncomeOpen(false);
    }catch(error){
      console.error("Failed to add income:", error);
    }
  };


  const handleRemoveIncome = async () => {
    const amount = Number(incomeInput);
    if(amount <= 0){
      return;
    }
    if(amount > income){
      setIncomeError("Enter a valid amount.");
      return;
    }

    if (!incomeInput || amount <= 0) {
      setIncomeError("Amount must be greater than 0.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/income", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: income - amount,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to remove income");
      }
      const data = await response.json();
      setIncome(data.amount);
      setIncomeInput("");
      setIncomeError("");
      setIncomeOpen(false);
    } catch (error) {
      console.error("Failed to remove income:", error);
    }
  };


  const totalExpenses = useMemo (() => { 
    return expenses.reduce(
    (total, expenses) => total + expenses.amount,
    0
  );
  }, [expenses]);


  const expenseCount = expenses.length;
  const balance = income - totalExpenses;
  

  const summary = {
    balance,
    income,
    expenses: totalExpenses,
  };

 
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Good {new Date().getHours() < 12 ? "morning" : "evening"}, {user?.name} 👋
        </h1>

        <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          Here's your financial overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          theme={theme}
          title="Balance"
          amount={`₹${summary.balance.toLocaleString("en-IN")}`}
          description="Available balance"
        />

        <SummaryCard
          theme={theme}
          title="Income"
          amount={`₹${summary.income.toLocaleString("en-IN")}`}
          description="This month"
        />

        <SummaryCard
          theme={theme}
          title="Expenses"
          amount={`₹${summary.expenses.toLocaleString("en-IN")}`}
          description={`${expenseCount} expenses`}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
      <AddExpenseDialog
        onAddExpense={handleAddExpense}
        theme={theme}
      />

      <Dialog open={incomeOpen} onOpenChange={(open) => {
        setIncomeOpen(open);
        if (open){
          setIncomeInput("");
        }
      }}>
        
       <DialogTrigger
          render={
            <button
              type="button"
              className="rounded-lg bg-[#23355d] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Manage Income
            </button>
          }
        />

        <DialogContent className={theme === "Dark" ? "bg-gray-900 border-gray-800 text-white" : ""}>
          <DialogHeader>
            <DialogTitle>Manage Income</DialogTitle>

            <DialogDescription className={theme === "Dark" ? "text-gray-400" : ""}>
              Update your current income balance.
            </DialogDescription>
          </DialogHeader>

          <div className={theme === "Dark" ? "rounded-lg bg-gray-800 p-4" : "rounded-lg bg-gray-50 p-4"}>
            <p className={theme === "Dark" ? "text-sm text-gray-400" : "text-sm text-gray-500"}>
              Current Income
            </p>
            <p className="mt-1 text-xl font-semibold">
              ₹{income.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              placeholder="0.00"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              className={theme === "Dark" ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-gray-500" : "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"}
            />
          </div>

          {incomeError && (
            <p className="text-sm text-red-500">
              {incomeError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                className={theme === "Dark" ? "rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800" : "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"}
              >
                Cancel
              </button>
            </DialogClose>

            <button
              type="button"
              onClick={handleRemoveIncome}
              className={theme === "Dark" ? "rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800" : "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"}
            >
              - Remove Income
            </button>

            <button
              type="button"
              onClick={handleAddIncome}
              className="rounded-lg bg-[#23355d] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              + Add Income
            </button>

          </div>
        </DialogContent>
      </Dialog>
      </div>

      <RecentExpenses expenses={expenses} theme={theme} />
      <SpendingChart expenses={expenses} theme={theme}/>
    </div>
  );
}

export default Dashboard;