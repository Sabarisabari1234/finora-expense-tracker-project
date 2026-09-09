import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wallet } from "lucide-react";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await fetch(
          `https://finora-backend-ogsi.onrender.com/api/users/verify-email/${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to verify email");
          return;
        }

        setMessage(data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        console.error("Failed to verify email:", error);
        setError("Something went wrong. Please try again.");
      }
    }

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#23355d] text-white">
            <Wallet size={28} />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Verify Email
          </h1>

          {message && (
            <p className="mt-4 text-sm text-green-400">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;