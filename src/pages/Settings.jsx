import React from "react";
import Profile from "../common/components/Settings/Profile";
import SignIn from "../common/components/Settings/SignIn";
import { useAuth } from "../common/contexts/authContext";

const Settings = () => {
  const { error, status } = useAuth();
  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>
      <div className="flex flex-col gap-2">
        {status === "AUTHORIZED" ? (
          <>
            <Profile />
          </>
        ) : (
          <>
            <SignIn />
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
