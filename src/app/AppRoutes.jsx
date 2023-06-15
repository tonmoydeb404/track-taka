import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/layout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/Error/NotFound";
import Feedback from "../pages/Feedback";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Transections from "../pages/Transections";
import CreateTransection from "../pages/Transections/CreateTransection";
import EditTransection from "../pages/Transections/EditTransection";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feedback" element={<Feedback />} />

      {/* app routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transections" element={<Transections />} />
        <Route path="/transections/create" element={<CreateTransection />} />
        <Route path="/transections/edit/:id" element={<EditTransection />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
