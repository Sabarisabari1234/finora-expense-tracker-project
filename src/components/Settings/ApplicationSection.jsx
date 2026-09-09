function ApplicationSection({ theme }) {
  return (
    <div className={`rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
      <div className="mb-5">
        <h2 className="font-semibold">
          Application
        </h2>

        <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          Information about Finora.
        </p>
      </div>

      <div className={`flex items-center justify-between border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
        <div>
          <p className="text-sm font-medium">
            About Finora
          </p>

          <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
            Personal finance management made simple.
          </p>
        </div>

        <span className={`text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          Finora
        </span>
      </div>

      <div className={`flex items-center justify-between border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
        <div>
          <p className="text-sm font-medium">
            Version
          </p>

          <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
            Current application version.
          </p>
        </div>

        <span className={`text-sm font-medium ${theme === "Dark" ? "text-gray-300" : "text-gray-700"}`}>
          1.0.0
        </span>
      </div>
    </div>
  );
}

export default ApplicationSection;