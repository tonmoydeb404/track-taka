import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const PublicOutlet = () => {
  const location = useLocation();
  const { user, status } = useAuth();

  if (status === "AUTHORIZED" && user !== null)
    return <Navigate to={location.state?.path || "/dashboard"} />;

  return <Outlet context={{ user, status }} />;
};

export default PublicOutlet;
