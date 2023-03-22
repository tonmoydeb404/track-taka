import React from "react";
import { toast } from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { useAuth } from "../../contexts/authContext";
import { useTransection } from "../../contexts/transectionContext";

const SignIn = () => {
  const { login, status } = useAuth();
  const { importTransections } = useTransection();

  const handleLogin = async () => {
    try {
      const response = await login();
      // if successfully logged in then import existing data
      if (response) {
        const promise = importTransections(response);
        await toast.promise(promise, {
          loading: "importing existing transections...",
          success: "successfully imported transections",
          error: "cannot import transections",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {status === "UNAUTHORIZED" ? (
        <div className="settings_item">
          <h3 className="settings_item_title">Sign In With Google</h3>

          <button
            className="btn btn-icon btn-success ml-auto"
            onClick={handleLogin}
          >
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
      )}
    </>
  );
};

export default SignIn;
