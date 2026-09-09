import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowRight } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
      setError("Please enter a valid email address.");
      return;
    }

    if(password.length < 6){
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://finora-backend-ogsi.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage(data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#23355d] text-white">
            <Wallet size={28} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Start managing your finances with Finora.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm">

          <form onSubmit={handleRegister} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Name
              </label>

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#23355d] focus:ring-2 focus:ring-[#23355d]/10"
              />
            </div>

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
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
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
            {message && (
              <div className="rounded-lg border border-green-900 bg-green-950 px-4 py-3 text-sm text-green-400">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#23355d] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={17} />}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="ml-1 font-medium text-blue-400 hover:underline"
            >
              Login
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Register;