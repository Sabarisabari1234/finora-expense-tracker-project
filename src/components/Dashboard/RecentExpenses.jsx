import { ArrowUpRight } from "lucide-react";
import ExpenseRow from "./ExpenseRow";
import { Link } from "react-router-dom";

function RecentExpenses({ expenses, theme }) {
  const recentExpenses = expenses.slice(0, 4);

  return (
    <section className={`mt-8 max-w-6xl rounded-xl border ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
      <div className={`flex items-center justify-between border-b px-5 py-3 ${theme === "Dark" ? "border-gray-800" : "border-gray-200"}`}>
        <h2 className="font-semibold">Recent expenses</h2>

        <Link
          to="/expenses"
          className={`flex items-center gap-1 text-sm ${theme === "Dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
        >
          View all
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className={`divide-y ${theme === "Dark" ? "divide-gray-800" : "divide-gray-100"}`}>
        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              theme={theme}
            />
          ))
        ) : (
          <p className={`px-5 py-8 text-center text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-700"}`}>
            No expenses yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default RecentExpenses;