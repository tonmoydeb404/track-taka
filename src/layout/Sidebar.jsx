import React from "react";
import { NavLink } from "react-router-dom";
import { useGlobalContext } from "../common/contexts/globalContext";
import CONSTANT from "../data/constant.json";

const Sidebar = () => {
  const { theme, toggleSidebar, toggleTheme } = useGlobalContext();

  return (
    <div className="sidebar">
      <div className="sidebar_container">
        {/* sidebar brand */}
        <button
          className="text-xl font-medium bg-blue-600 hover:bg-blue-700 text-white sidebar_item"
          onClick={toggleSidebar}
        >
          <i className="icon bi bi-wallet px-2 py-0.5 bg-slate-900 rounded inline-block"></i>
          <span className="title">Track Taka</span>
        </button>

        {/* sidebar links */}
        <ul className="sidebar_links mt-10">
          {CONSTANT.links &&
            CONSTANT.links.length &&
            CONSTANT.links.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `sidebar_links_item ${isActive ? "active" : ""}`
                  }
                  end
                >
                  <i className={`bi bi-${item.icon} icon`}></i>
                  <span className=" title">{item.title}</span>
                </NavLink>
              </li>
            ))}
        </ul>

        {/* sidebar theme */}
        <button
          className="bg-slate-900/20 dark:bg-white/5 dark:hover:bg-white/10 sidebar_item"
          onClick={toggleTheme}
        >
          <i
            className={`icon bi ${
              theme == "dark" ? "bi-sun-fill" : "bi-moon-fill"
            } px-2 py-1 bg-blue-600 text-white rounded inline-block`}
          ></i>

          <span className="title">light theme</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
