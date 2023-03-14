import React from "react";
import { BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const AuthItem = ({ user }) => {
  const navigate = useNavigate();
  const { handleLogOut } = useAuth();

  const logoutAction = async () => {
    await handleLogOut();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="settings_item">
      <img src={user.photoURL} alt="" className="w-12 h-12 rounded" />

      <h2>{user.displayName}</h2>

      <button
        className="btn btn-icon btn-danger ml-auto"
        onClick={logoutAction}
      >
        <BsBoxArrowRight />
      </button>
    </div>
  );
};

export default AuthItem;
