import {
  LayoutDashboard,
  Receipt,
  ChartNoAxesColumn,
  WalletCards,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({theme}) {
  return (
    <aside className={`min-h-screen w-64 border-r px-4 py-6 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>

      {/* Logo */}
      <NavLink to='/'>
      <div className="mb-8 px-3">
        <h1 className="text-xl font-semibold">
          Finora
        </h1>
      </div>
      </NavLink>

      {/* Navigation */}
      <nav className="space-y-1">

        <NavLink
          to="/"
          end
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? theme === "Dark" ? "bg-[#23355d] text-white" : "bg-[#e8eef9] text-[#23355d]" : theme === "Dark" ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? theme === "Dark" ? "bg-[#23355d] text-white" : "bg-[#e8eef9] text-[#23355d]" : theme === "Dark" ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <Receipt size={19} />
          Expenses
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? theme === "Dark" ? "bg-[#23355d] text-white" : "bg-[#e8eef9] text-[#23355d]" : theme === "Dark" ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <ChartNoAxesColumn size={19} />
          Analytics
        </NavLink>

        <NavLink
          to="/budgets"
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? theme === "Dark" ? "bg-[#23355d] text-white" : "bg-[#e8eef9] text-[#23355d]" : theme === "Dark" ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <WalletCards size={19} />
          Budgets
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? theme === "Dark" ? "bg-[#23355d] text-white" : "bg-[#e8eef9] text-[#23355d]" : theme === "Dark" ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <Settings size={19} />
          Settings
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;