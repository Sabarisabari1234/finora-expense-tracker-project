import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SpendingChart({ expenses, theme }) {
  const categoryTotals = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const category = expense.category.toLowerCase();

      if (!totals[category]) {
        totals[category] = 0;
      }

      totals[category] += expense.amount;
    });

    return totals;
  }, [expenses]);

  const data = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <section className={`mt-8 max-w-6xl rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
      <div className="mb-6">
        <h2 className="font-semibold">
          Spending by category
        </h2>

        <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          Your spending by category.
        </p>
      </div>

      {data.length > 0 ? (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tick={{ fill: theme === "Dark" ? "#d1d5db" : "#374151" }}
              />

              <YAxis
                tick={{ fill: theme === "Dark" ? "#d1d5db" : "#374151" }}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
                cursor={{ fill: "#23355d", opacity: 0.25 }}
                contentStyle={{
                  backgroundColor: theme === "Dark" ? "#111827" : "#ffffff",
                  borderColor: theme === "Dark" ? "#374151" : "#e5e7eb",
                  color: theme === "Dark" ? "#ffffff" : "#111827",
                }}
              />

              <Bar
                dataKey="amount"
                fill="#23355d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className={`py-16 text-center text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-600"}`}>
          No spending data yet.
        </p>
      )}
    </section>
  );
}

export default SpendingChart;