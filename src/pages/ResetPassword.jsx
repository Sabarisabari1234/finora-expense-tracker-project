import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wallet, ArrowLeft } from "lucide-react";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { token } = useParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `https://finora-backend-ogsi.onrender.com/api/users/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Failed to reset password:", error);
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
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Enter your new password below.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                New password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#23355d] focus:ring-2 focus:ring-[#23355d]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Confirm password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Reset password
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

export default ResetPassword;