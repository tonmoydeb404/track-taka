import React from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import { TbCurrencyTaka } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import links from "../../data/links.json";
import { getBreakpointValue } from "../../utilities/getBreakpoint";
import GetIcon from "../components/GetIcon";
import { useGlobal } from "../contexts/globalContext";
import { useTheme } from "../contexts/themeContext";

const Sidebar = () => {
  const { sidebar, toggleSidebar, hideSidebar } = useGlobal();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="sidebar"
      onClick={() => {
        if (sidebar) {
          hideSidebar();
        }
      }}
    >
      <div className="sidebar_container " onClick={(e) => e.stopPropagation()}>
        {/* sidebar brand */}
        <button
          className="sidebar_item sidebar_brand btn-primary "
          onClick={toggleSidebar}
        >
          <TbCurrencyTaka className="icon" />

          <span className="title text-xl font-semibold">Track Taka</span>
        </button>

        {/* sidebar links */}
        <ul className="sidebar_links mt-10">
          {links
            ? links.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    if (window.innerWidth <= getBreakpointValue("lg")) {
                      hideSidebar();
                    }
                  }}
                >
                  <NavLink to={item.link} className="sidebar_item" end>
                    <GetIcon name={item.icon} className="icon" />

                    <span className=" title">{item.title}</span>
                  </NavLink>
                </li>
              ))
            : null}
        </ul>

        {/* sidebar theme */}
        <button
          className="sidebar_item bg-slate-900 text-white dark:bg-slate-800"
          onClick={toggleTheme}
        >
          {theme == "dark" ? (
            <BiSun className="icon" />
          ) : (
            <BiMoon className="icon" />
          )}

          <span className="title">light theme</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
