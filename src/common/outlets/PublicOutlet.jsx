import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicOutlet = () => {
  const { user, status } = useAuth();

  if (status === "AUTHORIZED") return <Navigate to="/dashboard" />;

  return <Outlet context={{ user, status }} />;
};

export default PublicOutlet;
