import React, { useState } from "react";
import toast from "react-hot-toast";
import ConfirmCard from "../../common/components/ConfirmCard";
import Modal from "../../common/components/Modal";
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

  // logout modal
  const [logoutModal, setLogoutModal] = useState(false);
  const handleLogoutModal = async (makeBackup) => {
    // make modal invisible
    setLogoutModal(false);
    // check for making backup
    if (makeBackup) {
      await uploadTransections({ uid: user?.uid, data: transections });
    }
    // logout from app
    await handleLogOut();
    clearTransection();
    // toast
    toast.success("log out successfully");
  };

  // signin modal
  const [signinModal, setSigninModal] = useState(false);
  const handleSigninModal = async (downloadData) => {
    setSigninModal(false);
    if (downloadData) {
      await downloadTransections({
        uid: user?.uid,
        updateState: insertTransection,
      });
    } else {
      toast.error("transections not downloaded");
    }
  };

  // handle user log in
  const handleLogIn = async () => {
    try {
      await handleSignIn();
      setSigninModal(true);
    } catch (error) {
      console.log(error);
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
                  className="btn btn-danger ml-auto"
                  onClick={() => setLogoutModal(true)}
                >
                  <i className="bi bi-box-arrow-right"></i>
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
                        {new Date(autoBackup.lastTime).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  <div className="settings_item">
                    <h2>Backup Data Now</h2>

                    <button
                      className="btn btn-success ml-auto"
                      onClick={() =>
                        uploadTransections({
                          uid: user?.uid,
                          data: transections,
                        })
                      }
                    >
                      <i className="bi bi-cloud-upload"></i>
                    </button>
                  </div>

                  <div className="settings_item">
                    <h2>Download Data</h2>

                    <button
                      className="btn btn-warning ml-auto"
                      onClick={() =>
                        downloadTransections({
                          uid: user?.uid,
                          updateState: insertTransection,
                        })
                      }
                    >
                      <i className="bi bi-cloud-download"></i>
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
                      className="btn btn-primary ml-auto"
                      onClick={handleLogIn}
                    >
                      <i className="bi bi-google"></i>
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

      <Modal showModal={logoutModal}>
        <ConfirmCard
          title={"Backup Alert"}
          text="make backup before you logout. **it will erase all previous backup from server"
          callBack={handleLogoutModal}
        />
      </Modal>
      <Modal showModal={signinModal}>
        <ConfirmCard
          title={"Download Data"}
          text="make sure your transections are uptodate. download your previous backup from server"
          callBack={handleSigninModal}
        />
      </Modal>
    </>
  );
};

export default Settings;
