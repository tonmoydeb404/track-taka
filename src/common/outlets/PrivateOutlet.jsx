import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const PrivateOutlet = () => {
  const location = useLocation();
  const { user, status } = useAuth();

  if (status === "UNAUTHORIZED" && user === null)
    return <Navigate to="/signin" state={{ path: location.pathname }} />;

  return <Outlet context={{ user, status }} />;
};

export default PrivateOutlet;
