import React from "react";
import { Toaster } from "react-hot-toast";
import Preloader from "../common/components/Preloader";
import { GlobalProvider } from "../common/contexts/globalContext";
import { ThemeProvider } from "../common/contexts/themeContext";
import { TransectionProvider } from "../common/contexts/transectionContext";
import ServiceWorker from "../pwa/serviceWorker";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <GlobalProvider>
        <TransectionProvider>
          <Preloader />
          <Toaster position="bottom-right" />
          <AppRoutes />
          <ServiceWorker />
        </TransectionProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
};

export default App;
