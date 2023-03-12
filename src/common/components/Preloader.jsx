import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Preloader = () => {
  const { status } = useAuth();
  useEffect(() => {
    // show preloader until the authorization is completed
    document.body.dataset.preloader = !status || status === "INITIAL";
  }, [status]);

  return null;
};

export default Preloader;
