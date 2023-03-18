import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/layout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Transections from "../pages/Transections";
import CreateTransection from "../pages/Transections/CreateTransection";
import EditTransection from "../pages/Transections/EditTransection";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* app routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transections" element={<Transections />} />
        <Route path="/transections/create" element={<CreateTransection />} />
        <Route path="/transections/edit/:id" element={<EditTransection />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
