import { useState } from "react";
import { Search, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddExpenseDialog from "@/components/Expenses/AddExpenseDialog";
import EditExpenseDialog from "@/components/Expenses/EditExpenseDialog";

function Expenses({ expenses, setExpenses, handleAddExpense, theme, setToken, setUser }) {

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  async function handleEditExpense(updatedExpense) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://finora-backend-ogsi.onrender.com/api/expenses/${updatedExpense.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedExpense),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }
      const savedExpense = await response.json();

      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === updatedExpense.id
            ? {
                ...savedExpense,
                id: savedExpense._id,
              }
            : expense
        )
      );
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  }

  async function handleDeleteExpense(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://finora-backend-ogsi.onrender.com/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== id)
      );

      return true;
    } catch (error) {
      console.error("Failed to delete expense:", error);
      return false;
    }
  }

  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(search.toLowerCase()) ||
    expense.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Expenses
        </h1>
        <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          Track and manage your spending.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-400 ${
              theme === "Dark"
                ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-500"
                : "border-gray-200 bg-white text-gray-900"
            }`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                theme === "Dark"
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <AddExpenseDialog
          onAddExpense={handleAddExpense}
          theme={theme}
        />
      </div>

      <div className={`mt-6 overflow-hidden rounded-xl border ${
        theme === "Dark"
          ? "border-gray-800 bg-gray-900"
          : "border-gray-200 bg-white"
      }`}>

        <div className={`grid grid-cols-5 border-b px-5 py-3 text-xs font-medium ${
          theme === "Dark"
            ? "border-gray-800 text-gray-400"
            : "border-gray-200 text-gray-500"
        }`}>
          <span>
            Expense
          </span>
          <span>
            Category
          </span>
          <span>
            Date
          </span>
          <span className="text-right">
            Amount
          </span>
          <span className="text-right">
            Actions
          </span>
        </div>

        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`grid grid-cols-5 border-t px-5 py-4 text-sm ${
                theme === "Dark"
                  ? "border-gray-800 text-white"
                  : "border-gray-100 text-gray-900"
              }`}
            >
              <span className="font-medium">
                {expense.name}
              </span>

              <span className={theme === "Dark" ? "text-gray-400" : "text-gray-500"}>
                {expense.category}
              </span>

              <span className={theme === "Dark" ? "text-gray-400" : "text-gray-500"}>
                {expense.date}
              </span>

              <span className="text-right font-medium">
                ₹{expense.amount}
              </span>

              <div className="flex justify-end gap-3">

                <EditExpenseDialog
                  expense={expense}
                  onEditExpense={handleEditExpense}
                  theme={theme}
                />

                <AlertDialog
                  open={deleteId === expense.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setDeleteId(null);
                    }
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <div
                      onClick={() => setDeleteId(expense.id)}
                      className={`cursor-pointer ${
                        theme === "Dark"
                          ? "text-gray-500 hover:text-red-400"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Trash2 size={17} />
                    </div>
                  </AlertDialogTrigger>

                  <AlertDialogContent className={theme === "Dark" ? "bg-gray-900 border-gray-800 text-white" : ""}>

                    <AlertDialogHeader>

                      <AlertDialogTitle>
                        Delete expense?
                      </AlertDialogTitle>

                      <AlertDialogDescription className={theme === "Dark" ? "text-gray-400" : ""}>
                        Are you sure you want to delete "{expense.name}"?
                        This action cannot be undone.
                      </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>

                      <AlertDialogCancel className={theme === "Dark" ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700" : ""}>
                        Cancel
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={async () => {
                          const deleted = await handleDeleteExpense(expense.id);

                          if (deleted) {
                            setDeleteId(null);
                          }
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>

                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <p className={`py-10 text-center text-sm ${
            theme === "Dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {search
              ? `No expenses found for "${search}".`
              : "No expenses yet."}
          </p>
        )}
      </div>
    </div>
  );
}

export default Expenses;