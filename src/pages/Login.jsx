import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, ChartNoAxesCombined, PiggyBank, Target, TrendingUp } from "lucide-react";

function Login({setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
      setError("Please enter valid email address.")
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      navigate("/");
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111827]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE - FINORA INTRO */}
        <div className="flex flex-col justify-center bg-[#23355d] px-8 py-12 text-white sm:px-12 lg:px-16">

          <div className="mx-auto w-full max-w-xl">

            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Wallet size={24} />
              </div>

              <span className="text-2xl font-bold">
                Finora
              </span>
            </div>

            {/* Main heading */}
            <h1 className="max-w-lg text-4xl font-bold leading-tight sm:text-5xl">
              Take control of your money, effortlessly.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/70">
              Finora helps you track expenses, manage income, set budgets,
              and understand your spending — all from one simple dashboard.
            </p>

            {/* Features */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <ChartNoAxesCombined size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Track Expenses
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Know exactly where your money goes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Manage Income
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Keep your earnings organized.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Target size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Set Budgets
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Plan your spending with confidence.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <PiggyBank size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Understand Spending
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    See where your money is really going.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-10 flex items-center gap-2 text-sm text-white/50">
              <span>Simple.</span>
              <span>•</span>
              <span>Smart.</span>
              <span>•</span>
              <span>Secure.</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE - LOGIN */}
        <div className="flex items-center justify-center bg-[#111827] px-6 py-12 sm:px-8">

          <div className="w-full max-w-md">

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Sign in to continue to your Finora account.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm">

              <form onSubmit={handleLogin} className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#23355d] focus:ring-2 focus:ring-[#23355d]/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-xs font-medium text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#23355d] focus:ring-2 focus:ring-[#23355d]/10"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#23355d] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight size={17} />}
                </button>

              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-800" />
                <span className="text-xs text-gray-500">
                  OR
                </span>
                <div className="h-px flex-1 bg-gray-800" />
              </div>

              <p className="text-center text-sm text-gray-400">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="ml-1 font-medium text-blue-400 hover:underline"
                >
                  Create account
                </button>
              </p>

            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              © 2026 Finora. All rights reserved.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;