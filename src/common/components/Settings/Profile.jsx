import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsBoxArrowRight } from "react-icons/bs";
import { useAuth } from "../../contexts/authContext";
import { useTransection } from "../../contexts/transectionContext";
import SettingsModal from "./SettingsModal";

const Profile = () => {
  const { user, logout } = useAuth();
  const { clearTransections, exportTransections, transections } =
    useTransection();
  const [showModal, setShowModal] = useState(false);

  // handle log out
  const handleLogout = async (backup = false) => {
    try {
      setShowModal(false);
      // make a backup
      if (backup) {
        const backupPromise = exportTransections();
        await toast.promise(backupPromise, {
          loading: "backing up...",
          success: "successfully backed up.",
          error: "cannot backup transections",
        });
      }
      const promise = Promise.all([await logout(), await clearTransections()]);
      await toast.promise(promise, {
        loading: "logging out...",
        success: "successfully logged out.",
        error: "something wents to wrong!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handle click
  const handleClick = async () => {
    if (transections.length) {
      setShowModal(true);
    } else {
      await handleLogout(false);
    }
  };

  return (
    <>
      <div className="settings_item">
        <img
          src={user?.photoURL}
          alt=""
          className="w-12 h-12 rounded"
          referrerPolicy="no-referrer"
        />

        <h2 className="settings_item_title">{user?.displayName}</h2>

        <button
          className="btn btn-icon btn-danger ml-auto"
          onClick={handleClick}
        >
          <BsBoxArrowRight />
        </button>
      </div>
      <SettingsModal
        isOpen={showModal}
        onAgree={async () => await handleLogout(true)}
        onDisagree={async () => await handleLogout(false)}
        onClose={() => setShowModal(false)}
        title="Make a backup!"
        description={
          "By signing out all existing transections will be removed & this task cannot be undone. if you don't want to loose your transections then make a backup!"
        }
        agreeText="Backup"
        disagreeText="Avoid"
      />
    </>
  );
};

export default Profile;
