import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsBoxArrowRight } from "react-icons/bs";
import { useAuth } from "../../contexts/authContext";
import { useTransection } from "../../contexts/transectionContext";
import SettingsModal from "./SettingsModal";

const Profile = () => {
  const { user, logout } = useAuth();
  const { clearTransections } = useTransection();
  const [showModal, setShowModal] = useState(false);

  // handle log out
  const handleLogout = async () => {
    try {
      setShowModal(false);
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
          onClick={() => setShowModal(true)}
        >
          <BsBoxArrowRight />
        </button>
      </div>
      <SettingsModal
        isOpen={showModal}
        onAgree={handleLogout}
        onDisagree={() => setShowModal(false)}
        onClose={() => setShowModal(false)}
        title="Want to logout?"
        description={
          "This action will remove all of your transections from this app and this action cannot be undone."
        }
      />
    </>
  );
};

export default Profile;
