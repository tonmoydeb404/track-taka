import React from "react";
import { useAuthContext } from "../../common/contexts/authContext";

const AuthCard = () => {
  const { handleSignIn } = useAuthContext();

  return (
    <>
      <div className="settings_item">
        <h2>Login with google</h2>

        <button className="btn btn-primary ml-auto" onClick={handleSignIn}>
          <i className="bi bi-google"></i>
        </button>
      </div>

      <div className="settings_item">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
          alt=""
          className="w-12 h-12 rounded"
        />

        <h2>Tonmoy Deb</h2>

        <button className="btn btn-danger ml-auto">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </>
  );
};

export default AuthCard;
