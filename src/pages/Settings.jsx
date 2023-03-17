import React from "react";
import AuthItem from "../common/components/Settings/AuthItem";
import { useAuth } from "../common/contexts/authContext";
import { useGlobal } from "../common/contexts/globalContext";

const Settings = () => {
  const { user } = useAuth();
  const { isOnline } = useGlobal();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Setttings</h2>
      </div>

      <div className="mt-10">
        <div className="w-full lg:w-[500px] flex flex-col gap-2.5">
          {isOnline ? (
            <>
              <AuthItem user={user} />
            </>
          ) : (
            <>
              <div className="settings_item">
                <h2>make sure your internet connection is stable</h2>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
