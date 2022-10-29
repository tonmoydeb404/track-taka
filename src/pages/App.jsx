import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import AutoBackup from "../common/components/AutoBackup";
import { AuthProvider } from "../common/contexts/AuthContext";
import { GlobalProvider } from "../common/contexts/GlobalContext";
import { TransectionProvider } from "../common/contexts/TransectionContext";
import Layout from "../layout";
import ServiceWorker from "../pwa/serviceWorker";
import Analytics from "./Analytics";
import HandleTransection from "./HandleTransection";
import Settings from "./Settings";
import Transections from "./Transections";

const App = () => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <TransectionProvider>
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
              <Route path="/settings" element={<Settings />}></Route>
            </Routes>
          </Layout>
          <AutoBackup />
          <ServiceWorker />
        </TransectionProvider>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default App;
