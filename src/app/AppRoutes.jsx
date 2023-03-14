import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/layout";
import PrivateOutlet from "../common/outlets/PrivateOutlet";
import PublicOutlet from "../common/outlets/PublicOutlet";
import SignIn from "../pages/Auth/SignIn";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Transections from "../pages/Transections";
import CreateTransection from "../pages/Transections/CreateTransection";
import EditTransection from "../pages/Transections/EditTransection";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* unauthorized routes */}
      <Route element={<PublicOutlet />}>
        <Route path="/signin" element={<SignIn />} />
      </Route>
      {/* authorized routes */}
      <Route element={<PrivateOutlet />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transections" element={<Transections />} />
          <Route path="/transections/create" element={<CreateTransection />} />
          <Route path="/transections/edit/:id" element={<EditTransection />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
