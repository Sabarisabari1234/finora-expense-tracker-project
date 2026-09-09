import SpendingChart from "../components/Dashboard/SpendingChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function Analytics({ expenses, theme }) {
 
  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const averageExpenses = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const biggestExpenses = expenses.length > 0 ? Math.max(...expenses.map((expense) => expense.amount)) : 0;

  const monthlyTotal = {};
  expenses.forEach((expense) => {
    const month = expense.date.slice(0, 7);

    if (!monthlyTotal[month]){
      monthlyTotal[month] = 0;
    }
    monthlyTotal[month] += expense.amount
  });

  const monthlyData = Object.entries(monthlyTotal)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) =>({
      month: new Date(`${month}-01`).toLocaleString("en-IN", {
        month: "short",
      }),
      amount,
    }));

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Analytics
      </h1>
      <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
        Understand your spending habits.
      </p>

      {expenses.length === 0 ? (
        <div className={`mt-6 rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
          <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-600"}`}>
            No expenses yet. Add an expense to see your analytics.
          </p>
        </div>
        ):(
          <>
        <div className={`mt-6 rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-25">

            <div>
              <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                Total Spent
              </p>
              <p className="mt-1 text-2xl font-semibold">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                Average expense
              </p>
              <p className="mt-1 text-2xl font-semibold">
                ₹{Math.round(averageExpenses).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                Biggest Expense
              </p>
              <p className="mt-1 text-2xl font-semibold">
                ₹{biggestExpenses.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <SpendingChart expenses={expenses} theme={theme} />

        
        <div className={`mt-6 rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
          <div className="mb-6">
            <h2 className="font-semibold">
              Spending over time
            </h2>

            <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Track your spending month by month.
            </p>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3"/>

                  <XAxis 
                    dataKey="month"
                    tick={{fontSize: 12, fill: theme === "Dark" ? "#d1d5db" : "#374151"}}
                    tickMargin={8}
                    />

                  <YAxis
                    tick={{fill: theme === "Dark" ? "#d1d5db" : "#374151"}}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    contentStyle={{
                      backgroundColor: theme === "Dark" ? "#111827" : "#ffffff",
                      borderColor: theme === "Dark" ? "#374151" : "#e5e7eb",
                      color: theme === "Dark" ? "#ffffff" : "#111827",
                    }}
                  />

                 <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{r: 4, fill: "#111827", stroke: "#60a5fa", strokeWidth: 2}}
                  activeDot={{r: 6, fill: "#60a5fa"}}
                />
                </LineChart>
              </ResponsiveContainer>
          </div>
        </div>
        </>
        )}
    </div>

    
  );
}

export default Analytics;