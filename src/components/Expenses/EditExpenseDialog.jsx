import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


function EditExpenseDialog({ expense, onEditExpense, theme }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setDescription(expense.name);
      setCategory(expense.category.toLowerCase());
      setDate(expense.date);
      setError("");
    }
  }, [expense]);


  function resetForm() {
    setAmount("");
    setDescription("");
    setCategory("");
    setDate("");
    setError("");
  }


  function handleEditExpense() {

    if (!amount || !description || !category || !date) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const updatedExpense = {
      id: expense.id,
      name: description,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      date: date,
      amount: Number(amount),
    };

    onEditExpense(updatedExpense);

    resetForm();
    setOpen(false);
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger
        className={`${
          theme === "Dark"
            ? "text-gray-500 hover:text-blue-400"
            : "text-gray-400 hover:text-blue-500"
        }`}
      >
        <Pencil size={17} />
      </DialogTrigger>

      <DialogContent className={theme === "Dark" ? "bg-gray-900 border-gray-800 text-white" : ""}>

        <DialogHeader>
          <DialogTitle>
            Edit expense
          </DialogTitle>

          <DialogDescription className={theme === "Dark" ? "text-gray-400" : ""}>
            Update your expense details.
          </DialogDescription>
        </DialogHeader>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Amount
          </label>

          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={theme === "Dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description
          </label>

          <Textarea
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={theme === "Dark" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""}
          />
        </div>


        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Category
          </label>

          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger className={theme === "Dark" ? "bg-gray-800 border-gray-700 text-white" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="bills">Bills</SelectItem>
              <SelectItem value="entertainment">
                Entertainment
              </SelectItem>
              <SelectItem value="other">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Date
          </label>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={theme === "Dark" ? "bg-gray-800 border-gray-700 text-white" : ""}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">

          <DialogClose asChild>
            <button
              type="button"
              onClick={resetForm}
              className={theme === "Dark" ? "rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800" : "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"}
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            onClick={handleEditExpense}
            className="rounded-lg bg-[#23355d] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default EditExpenseDialog;