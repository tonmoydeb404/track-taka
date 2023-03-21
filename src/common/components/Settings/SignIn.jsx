import React from "react";
import { BiLoader } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { useAuth } from "../../contexts/authContext";

const SignIn = () => {
  const { login, status } = useAuth();
  return status === "UNAUTHORIZED" ? (
    <div className="settings_item">
      <h3 className="settings_item_title">Sign In With Google</h3>

      <button className="btn btn-icon btn-success ml-auto" onClick={login}>
        <BsGoogle />
      </button>
    </div>
  ) : (
    <div className="settings_item">
      <h3 className="settings_item_title">
        {status === "LOADING" ? "Signing In..." : "User Loading..."}
      </h3>

      <div className="btn btn-icon btn-primary ml-auto">
        <BiLoader className="animate-spin" />
      </div>
    </div>
  );
};

export default SignIn;
