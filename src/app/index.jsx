import React from "react";
import { Toaster } from "react-hot-toast";
import Preloader from "../common/components/Preloader";
import { AuthProvider } from "../common/contexts/authContext";
import { GlobalProvider } from "../common/contexts/globalContext";
import { ThemeProvider } from "../common/contexts/themeContext";
import { TransectionProvider } from "../common/contexts/transectionContext";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <AuthProvider>
          <TransectionProvider>
            <Preloader />
            <Toaster position="bottom-right" />
            <AppRoutes />
            {/* <ServiceWorker /> */}
          </TransectionProvider>
        </AuthProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
};

export default App;
