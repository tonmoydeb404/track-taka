import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "../assets/styles/style.css";
import Layout from "../layout";
import Analytics from "./Analytics";
import Expenses from "./Expenses";
import HandleTransection from "./HandleTransection";
import Incomes from "./Incomes";
import Settings from "./Settings";
import Transections from "./Transections";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Analytics />}></Route>
        <Route path="/transections" element={<Transections />}></Route>
        <Route path="/expenses" element={<Expenses />}></Route>
        <Route path="/incomes" element={<Incomes />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route
          path="/new-transection"
          element={<HandleTransection mode="create" />}
        ></Route>
      </Routes>
    </Layout>
  );
};

export default App;
