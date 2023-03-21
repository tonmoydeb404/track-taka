import { useEffect, useState } from "react";

const useOnline = () => {
  const [isOnline, setIsOnline] = useState();

  // update online state on window event
  useEffect(() => {
    if ("onLine" in navigator) {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener("offline", () => setIsOnline(false));
    window.addEventListener("online", () => setIsOnline(true));
  }, []);

  return {
    isOnline,
  };
};

export default useOnline;
