function ExpenseRow({ expense, theme }) {

  function formatDate(date) {
    const today = new Date();
    const expenseDate = new Date(date);

    if (
      today.toDateString() === expenseDate.toDateString()
    ) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      yesterday.toDateString() === expenseDate.toDateString()
    ) {
      return "Yesterday";
    }

    return expenseDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  }

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-sm font-medium">
          {expense.name}
        </p>

        <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          {expense.category} · {formatDate(expense.date)}
        </p>
      </div>

      <p className="text-sm font-medium">
        - ₹{expense.amount}
      </p>
    </div>
  );
}

export default ExpenseRow;