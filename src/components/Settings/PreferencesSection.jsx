import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PreferencesSection({ theme, setTheme }) {

  return (
    <>
      <div className={`rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
        <div className="mb-5">
          <h2 className="font-semibold">
            Preferences
          </h2>

          <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
            Customize how Finora works for you.
          </p>
        </div>

        <div className={`flex items-center justify-between border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
          <div>
            <p className="text-sm font-medium">
              Currency
            </p>

            <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Choose your preferred currency.
            </p>
          </div>

          <span className={`text-sm ${theme === "Dark" ? "text-gray-300" : "text-gray-700"}`}>
            INR (₹)
          </span>
        </div>

        <div className={`flex items-center justify-between border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
          <div>
            <p className="text-sm font-medium">
              Theme
            </p>

            <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Choose how Finora looks.
            </p>
          </div>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Light">Light</SelectItem>
              <SelectItem value="Dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => {
            setTheme("Dark");
          }}
          className={`text-sm ${theme === "Dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
        >
          Reset preferences
        </button>
      </div>
    </>
  );
}

export default PreferencesSection;