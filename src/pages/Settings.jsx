import AccountSection from "../components/Settings/AccountSection";
import PreferencesSection from "../components/Settings/PreferencesSection";
import ApplicationSection from "../components/Settings/ApplicationSection";

function Settings({ user, setUser, theme, setTheme, setToken }) {

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Settings
        </h1>

        <p className={`mt-1 text-sm ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
          Manage your Finora preferences.
        </p>
      </div>

      <AccountSection
        user={user}
        setUser={setUser}
        theme={theme}
        setToken={setToken}
      />

      <div className="space-y-6 mt-10">
        <PreferencesSection
          theme={theme}
          setTheme={setTheme}
        />

        <ApplicationSection
          theme={theme}
        />
      </div>
    </div>
  );
}

export default Settings;