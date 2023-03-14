import React from "react";
import { Toaster } from "react-hot-toast";
import Preloader from "../common/components/Preloader";
import { AuthProvider } from "../common/contexts/AuthContext";
import { GlobalProvider } from "../common/contexts/GlobalContext";
import { TransectionProvider } from "../common/contexts/TransectionContext";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <TransectionProvider>
          <Toaster position="bottom-right" />
          <AppRoutes />
          <Preloader />
          {/* <ServiceWorker /> */}
        </TransectionProvider>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default App;
