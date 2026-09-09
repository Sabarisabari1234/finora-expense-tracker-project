function SummaryCard({ title, amount, description, theme }) {
  return (
    <div className={`rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
      <p className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
        {title}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {amount}
      </p>

      <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
        {description}
      </p>
    </div>
  );
}

export default SummaryCard;