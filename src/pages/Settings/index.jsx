import React from "react";
import { BsBoxArrowRight } from "react-icons/bs";
import { useAuth } from "../../common/contexts/AuthContext";
import { useGlobal } from "../../common/contexts/GlobalContext";

const Settings = () => {
  const { user, handleLogOut } = useAuth();
  const { isOnline } = useGlobal();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Setttings</h2>
      </div>

      <div className="mt-10">
        <div className="w-full lg:w-[500px] flex flex-col gap-2.5">
          {user?.uid && isOnline ? (
            <>
              <div className="settings_item">
                <img
                  src={user?.photoURL}
                  alt=""
                  className="w-12 h-12 rounded"
                />

                <h2>{user?.displayName}</h2>

                <button
                  className="btn btn-icon btn-danger ml-auto"
                  onClick={handleLogOut}
                >
                  <BsBoxArrowRight />
                </button>
              </div>
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
