import { useEffect, useState } from "react";

const useSidebar = (defaultValue = false) => {
  const [sidebar, setSidebar] = useState(defaultValue);

  // show sidebar
  const showSidebar = () => setSidebar(true);

  // hide sidebar
  const hideSidebar = () => setSidebar(false);

  // toggle sidebar
  const toggleSidebar = () => setSidebar((prev) => !prev);

  // update ui on sidebar change
  useEffect(() => {
    document.body.dataset.sidebar = sidebar;
  }, [sidebar]);

  return { sidebar, showSidebar, hideSidebar, toggleSidebar };
};

export default useSidebar;
