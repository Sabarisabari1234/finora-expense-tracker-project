import { useState } from "react";

function AccountSection({ user, setUser, theme, setToken }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function handleSaveProfile() {
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to update profile");
        return;
      }

      setEditing(false);
      setUser(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Something went wrong. Please try again.");
    }
  }


  async function handleChangePassword() {
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if(currentPassword === newPassword){
      setPasswordError("New password must be different from current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      if (!response.ok) {
        setPasswordError(data.message || "Failed to change password");
        return;
      }

      setChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className={`rounded-xl border p-5 ${theme === "Dark" ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">
            Account
          </h2>

          <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
            Your Finora account information.
          </p>
        </div>

        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSaveProfile}
              className="text-sm font-medium text-blue-600"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(false)}
              className={`text-sm font-medium ${
                theme === "Dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-blue-600"
          >
            Edit
          </button>
        )}
      </div>

      <div className={`flex items-center justify-between border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
        <div>
          <p className="text-sm font-medium">
            Name
          </p>

          <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
            Your account name.
          </p>
        </div>

        {editing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-48 rounded-lg border px-3 py-2 text-sm outline-none ${theme === "Dark" ? "border-gray-700 bg-gray-800 text-white" : "border-gray-200 bg-white text-gray-900"}`}
          />
        ) : (
          <span className={`text-sm ${theme === "Dark" ? "text-gray-300" : "text-gray-700"}`}>
            {user?.name || "Loading..."}
          </span>
        )}
      </div>

      <div className={`flex items-center justify-between border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
        <div>
          <p className="text-sm font-medium">
            Email
          </p>

          <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
            Your registered email address.
          </p>
        </div>

        <span className={`text-sm ${theme === "Dark" ? "text-gray-300" : "text-gray-700"}`}>
          {user?.email || "Loading..."}
        </span>
      </div>

      <div className={`border-t py-4 ${theme === "Dark" ? "border-gray-800" : "border-gray-100"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              Change Password
            </p>

            <p className={`mt-1 text-xs ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
              Update your account password.
            </p>
          </div>

          {!changingPassword && (
            <button
              type="button"
              onClick={() => setChangingPassword(true)}
              className="text-sm font-medium text-blue-600"
            >
              Change Password
            </button>
          )}
        </div>

        {changingPassword && (
          <div className="mt-4 space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                theme === "Dark"
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                theme === "Dark"
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                theme === "Dark"
                  ? "border-gray-700 bg-gray-800 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            />

            {passwordError && (
              <p className="text-xs text-red-500">
                {passwordError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setChangingPassword(false)}
                className={`text-sm font-medium ${
                  theme === "Dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                className="text-sm font-medium text-blue-600"
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default AccountSection;