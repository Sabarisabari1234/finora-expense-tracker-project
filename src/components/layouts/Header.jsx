import { useLocation, useNavigate } from "react-router-dom";

function Header({setToken, user, setUser, theme }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles = {
    "/": "Dashboard",
    "/expenses": "Expenses",
    "/analytics": "Analytics",
    "/budgets": "Budgets",
    "/settings": "Settings",
  };

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  const title = pageTitles[location.pathname] || "Finora";

  return (
    <header className={`flex h-16 items-center justify-between border-b px-6 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>

      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">

        <div onClick={() => navigate("/settings")} className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-medium ${theme === "Dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <button
          onClick={handleLogout}
          className={`text-sm font-medium ${theme === "Dark" ? "text-gray-300 hover:text-red-400" : "text-gray-600 hover:text-red-600"}`}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Header;