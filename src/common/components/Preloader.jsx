import { useEffect } from "react";

const Preloader = () => {
  useEffect(() => {
    document.body.dataset.preloader = false;
  }, []);

  return null;
};

export default Preloader;
