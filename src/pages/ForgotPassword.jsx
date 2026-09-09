import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowLeft } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            const response = await fetch(
            "http://localhost:5000/api/users/forgot-password",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                email,
                }),
            }
            );

            const data = await response.json();

            if (!response.ok) {
            setError(data.message || "Failed to process password reset request");
            return;
            }

            setMessage(data.message);
        } catch (error) {
            console.error("Failed to process password reset:", error);
            setError("Something went wrong. Please try again.");
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
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Enter your email address and we'll help you reset your password.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-5">

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
              className="w-full rounded-lg bg-[#23355d] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Send reset link
            </button>

          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;