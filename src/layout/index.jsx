import React from "react";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="main pb-10">
          {/* <Navbar /> */}
          <div className="main_content">{children}</div>
        </div>
      </div>
      <MobileMenu />
    </>
  );
};

export default Layout;
