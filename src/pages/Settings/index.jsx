import React from "react";
import {
  BsBoxArrowRight,
  BsCloudDownload,
  BsCloudUpload,
} from "react-icons/bs";
import { useAuth } from "../../common/contexts/AuthContext";
import { useGlobal } from "../../common/contexts/GlobalContext";
import { useTransection } from "../../common/contexts/TransectionContext";
import {
  downloadTransections,
  uploadTransections,
} from "../../common/services/transectionServices";

const Settings = () => {
  const { user, handleLogOut } = useAuth();
  const { transections, insertTransection, clearTransection } =
    useTransection();
  const { autoBackup, setAutoBackupDuration, isOnline } = useGlobal();

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
