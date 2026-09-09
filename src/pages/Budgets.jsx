import { useState } from "react";


function Budgets({ budgets, setBudgets, expenses, theme, setToken, setUser }) {

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAmount, setEditingAmount] = useState("");

  const totalBudget = Object.values(budgets).reduce(
    (total, amount) => total + amount,
    0
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
  const totalSpent = monthlyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const totalRemaining = totalBudget - totalSpent;

  async function handleBudgetChange(category, value){
    const newAmount = Number(value);

    if(newAmount < 0){
      return;
    }
    setBudgets((currentBudgets) => ({
      ...currentBudgets,
      [category]: newAmount,
    }));

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/budgets/${category}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: newAmount,
          }),
        }
      );
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }
      
      if(!response.ok){
        throw new Error("Failed to update budget");
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Budgets
      </h1>

      <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
        Set monthly budgets and track your spending.
      </p>

      {/* Total budget */}
      <div className={`mt-6 rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
        <div className="flex items-center gap-25 ">
          <div>
            <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Total budget
            </p>
            <p className="mt-1 text-2xl font-semibold">
              ₹{totalBudget.toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Total spent
            </p>
            <p className="mt-1 text-2xl font-semibold">
              ₹{totalSpent.toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Remaining
            </p>
            <p className="mt-1 text-2xl font-semibold">
              ₹{totalRemaining.toLocaleString("en-IN")}
            </p>
          </div>
         
        </div>
      </div>

 

      {/* Category budgets */}
      <div className="mt-6 space-y-4">
        {Object.entries(budgets).map(([category, amount]) => {
          amount = Number.isFinite(amount) ? amount : 0;

          const spent = monthlyExpenses
            .filter(
              (expense) =>
                expense.category.toLowerCase() === category
            )
            .reduce(
              (total, expense) => total + expense.amount,
              0
            );
          
          const remaining = amount - spent;  
          const isOverBudget = spent > amount;
          const percentage = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

          return (
            <div
              key={category}
              className={`rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>

                <div className="flex items-center gap-3">
                  {editingCategory === category ? (
                    <input
                      type="number"
                      min="0"
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(e.target.value)}
                      className={`w-28 rounded-lg border px-3 py-1.5 text-right text-sm outline-none focus:border-gray-400 ${theme === "Dark" ? "border-gray-700 bg-gray-800 text-white" : "border-gray-200 bg-white text-gray-900"}`}
                    />
                  ) : (
                    <span className="font-semibold">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      if (editingCategory === category) {
                        await handleBudgetChange(category, editingAmount);
                        setEditingCategory(null);
                      } else {
                        setEditingCategory(category);
                        setEditingAmount(String(Number.isFinite(amount) ? amount : 0));
                      }
                    }}
                    className={`text-sm ${theme === "Dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    {editingCategory === category ? "Done" : "Edit"}
                  </button>
                </div>
              </div>

              <p className={`mt-2 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                Spent: ₹{spent.toLocaleString("en-IN")}
              </p>
              <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                {isOverBudget
                  ? `Over budget by ₹${(spent - amount).toLocaleString("en-IN")}`
                  : `Remaining: ₹${remaining.toLocaleString("en-IN")}`}
              </p>

              <div className={`mt-4 h-2 overflow-hidden rounded-full ${theme === "Dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                <div
                  className="h-full rounded-full bg-[#23355d]"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
              <p className={`mt-2 text-right text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                {Math.round(percentage)}% used
              </p>
              <p className="mt-1 text-xs font-medium">
                {isOverBudget ? "Over budget" : "Within budget"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Budgets;