import React from "react";
import { BsBoxArrowRight } from "react-icons/bs";
import { useAuth } from "../../contexts/authContext";

const Profile = () => {
  const { user, logout } = useAuth();
  return (
    <div className="settings_item">
      <img
        src={user?.photoURL}
        alt=""
        className="w-12 h-12 rounded"
        referrerPolicy="no-referrer"
      />

      <h2 className="settings_item_title">{user?.displayName}</h2>

      <button className="btn btn-icon btn-danger ml-auto" onClick={logout}>
        <BsBoxArrowRight />
      </button>
    </div>
  );
};

export default Profile;
