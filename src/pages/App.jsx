import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Preloader from "../common/components/Preloader";
import { AuthProvider } from "../common/contexts/AuthContext";
import { GlobalProvider } from "../common/contexts/GlobalContext";
import { TransectionProvider } from "../common/contexts/TransectionContext";
import PrivateOutlet from "../common/outlets/PrivateOutlet";
import PublicOutlet from "../common/outlets/PublicOutlet";
import Layout from "../layout";
import Dashboard from "./Dashboard";
import HandleTransection from "./HandleTransection";
import Home from "./Home";
import Settings from "./Settings";
import SignIn from "./SignIn";
import Transections from "./Transections";

const App = () => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <TransectionProvider>
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* only unauthorized users can visit */}
            <Route element={<PublicOutlet />}>
              <Route path="/signin" element={<SignIn />} />
            </Route>
            {/* only authorized users can visit */}
            <Route element={<PrivateOutlet />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transections" element={<Transections />} />
                <Route
                  path="/transections/create"
                  element={<HandleTransection mode="create" />}
                />
                <Route
                  path="/transections/edit/:id"
                  element={<HandleTransection mode="edit" />}
                />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
          <Preloader />
          {/* <ServiceWorker /> */}
        </TransectionProvider>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default App;
