import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "../assets/styles/style.css";
import { GlobalContextProvider } from "../common/contexts/globalContext";
import { TransectionContextProvier } from "../common/contexts/transectionContext";
import Layout from "../layout";
import Analytics from "./Analytics";
import Expenses from "./Expenses";
import HandleTransection from "./HandleTransection";
import Incomes from "./Incomes";
import Settings from "./Settings";
import Transections from "./Transections";

const App = () => {
  return (
    <GlobalContextProvider>
      <TransectionContextProvier>
        <Toaster position="bottom-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Analytics />}></Route>
            <Route path="/transections" element={<Transections />}></Route>
            <Route
              path="/transections/create"
              element={<HandleTransection mode="create" />}
            ></Route>
            <Route
              path="/transections/edit/:id"
              element={<HandleTransection mode="edit" />}
            ></Route>
            <Route path="/expenses" element={<Expenses />}></Route>
            <Route path="/incomes" element={<Incomes />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Routes>
        </Layout>
      </TransectionContextProvier>
    </GlobalContextProvider>
  );
};

export default App;
