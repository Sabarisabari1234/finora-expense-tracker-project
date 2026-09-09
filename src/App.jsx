import Sidebar from './components/layouts/Sidebar'
import Header from './components/layouts/Header'
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Budgets from './pages/Budgets';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { Route, Routes, BrowserRouter, useLocation, Navigate } from 'react-router-dom';


function App() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status === 401){
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          return;
        }

        const data = await response.json();
        setExpenses(
          data.map((expense) => ({
            ...expense,
            id: expense._id,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };

    fetchExpenses();
  }, [token]);


  useEffect(() => {
    const fetchIncome = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/income", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status === 401){
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          return;
        }

        const data = await response.json();
        if (data) {
          setIncome(data.amount);
        }
      } catch (error) {
        console.error("Failed to fetch income:", error);
      }
    };
    fetchIncome();
  }, [token]);


  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();

        if(response.status === 401){
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          return;
        }
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [token]);


    async function handleAddExpense(newExpense) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
      const savedExpense = await response.json();

      setExpenses((currentExpenses) => [
         {
        ...savedExpense,
        id: savedExpense._id,
        },
        ...currentExpenses,
      ]);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  }

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "Dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);


  const [budgets, setBudgets] = useState({});
  useEffect(() => {
    const fetchBudgets = async () =>{
      if(!token) return;

      try{
        const response = await fetch("http://localhost:5000/api/budgets",{
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });

        if(response.status === 401){
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          return;
        }

        const data = await response.json();

        if(!response.ok){
          throw new Error(data.message || "Failed to fetch budgets");
        }

        const budgetData = {};

        data.forEach((budget) => {
          budgetData[budget.category] = budget.amount;
        });
        
        setBudgets(budgetData);
      }catch(error){
        console.error("Failed to fetch budgets:", error);
      }
    };
    fetchBudgets();
  }, [token])


   function AppContent() {
    const location = useLocation();

    const isLoginPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname.startsWith("/reset-password/") || location.pathname.startsWith("/verify-email/");

    if(!token && !isLoginPage){
      return <Navigate to = "/login" replace />;
    }

    return (
      <>
        {isLoginPage ? (
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Routes>
        ) : (
          <div className={`flex min-h-screen ${theme === "Dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
            <Sidebar theme={theme} />
            <div className="flex flex-1 flex-col">
              <Header setToken={setToken} user={user} setUser={setUser} theme={theme} />
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="/" element={<Dashboard expenses={expenses} handleAddExpense={handleAddExpense} setExpenses={setExpenses} income={income} setIncome={setIncome} theme={theme}  setToken={setToken} user={user} setUser={setUser} />} />
                  <Route path="/expenses" element={<Expenses expenses={expenses} setExpenses={setExpenses} handleAddExpense={handleAddExpense} theme={theme} setToken={setToken} setUser={setUser} />} />
                  <Route path="/analytics" element={<Analytics expenses={expenses} theme={theme} />} />
                  <Route path="/budgets" element={<Budgets budgets={budgets} expenses={expenses} setBudgets={setBudgets} theme={theme} setToken={setToken} setUser={setUser}/>} />
                  <Route path="/settings" element={<Settings user={user} setUser={setUser} theme={theme} setTheme={setTheme} />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

