import React from "react";
import { Outlet } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="main pb-20 sm:pb-10">
          {/* <Navbar /> */}
          <div className="main_content">
            <Outlet />
          </div>
        </div>
      </div>
      <MobileMenu />
    </>
  );
};

export default Layout;
