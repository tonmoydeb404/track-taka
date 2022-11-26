import React from "react";
import toast from "react-hot-toast";
import {
  BsBoxArrowRight,
  BsCloudDownload,
  BsCloudUpload,
  BsGoogle,
} from "react-icons/bs";
import { useAuth } from "../../common/contexts/AuthContext";
import { useGlobal } from "../../common/contexts/GlobalContext";
import { useTransection } from "../../common/contexts/TransectionContext";
import {
  downloadTransections,
  uploadTransections,
} from "../../common/services/transectionServices";

const Settings = () => {
  const { handleSignIn, user, handleLogOut } = useAuth();
  const { transections, insertTransection, clearTransection } =
    useTransection();
  const { autoBackup, setAutoBackupDuration, isOnline } = useGlobal();

  // logout from app
  const handleSignOut = async () => {
    try {
      if (transections && transections.length) {
        await uploadTransections({ uid: user?.uid, data: transections });
      }
      // clear transections from local database
      await toast.promise(clearTransection(), {
        loading: "clearing transection from local server...",
        success: "transection cleared from local server.",
        error: "error in clearing transection",
      });
      // sign out from app
      await toast.promise(handleLogOut(), {
        loading: "signing out...",
        success: "sign out successfully",
        error: "error in sign out",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // handle user log in
  const handleLogIn = async () => {
    try {
      const res = await toast.promise(handleSignIn(), {
        loading: "logging in...",
        success: "login successfully",
        error: "error in sign in",
      });

      // validate user
      if (res && res.user?.uid) {
        await downloadTransections({
          uid: res.user?.uid,
          updateState: insertTransection,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Setttings</h2>
      </div>

      <div className="mt-10">
        <div className="w-full lg:w-[500px] flex flex-col gap-2.5">
          {user?.uid ? (
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
                  onClick={handleSignOut}
                >
                  <BsBoxArrowRight />
                </button>
              </div>

              {isOnline ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <div className="settings_item ">
                      <h2>Automatic backup data in</h2>

                      <select
                        className="ml-auto text-sm py-1 pl-2 select"
                        value={autoBackup.duration || 1}
                        onChange={(e) => {
                          setAutoBackupDuration(parseFloat(e.target.value));
                        }}
                      >
                        <option value={1}>01 Days</option>
                        <option value={2}>02 Days</option>
                        <option value={3}>03 Days</option>
                      </select>
                    </div>
                    {autoBackup.lastTime && (
                      <p className="text-xs pl-2 text-gray-600 dark:text-gray-300 ">
                        last backup at{" "}
                        {new Date(autoBackup.lastTime).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="settings_item">
                    <h2>Backup Data Now</h2>

                    <button
                      className="btn btn-icon btn-success ml-auto"
                      onClick={() =>
                        uploadTransections({
                          uid: user?.uid,
                          data: transections,
                        })
                      }
                    >
                      <BsCloudUpload />
                    </button>
                  </div>

                  <div className="settings_item">
                    <h2>Download Data</h2>

                    <button
                      className="btn btn-icon btn-warning ml-auto"
                      onClick={() =>
                        downloadTransections({
                          uid: user?.uid,
                          updateState: insertTransection,
                        })
                      }
                    >
                      <BsCloudDownload />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>make sure your internet connection is stable</p>
                </>
              )}
            </>
          ) : (
            <>
              <div className="settings_item">
                {isOnline ? (
                  <>
                    <h2>Login with google</h2>

                    <button
                      className="btn btn-icon btn-primary ml-auto"
                      onClick={handleLogIn}
                    >
                      <BsGoogle />
                    </button>
                  </>
                ) : (
                  <>
                    <h2>make sure your internet connection is stable</h2>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
