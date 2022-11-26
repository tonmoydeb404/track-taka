import React from "react";
import { BsMoonFill, BsSun, BsWallet } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useGlobal } from "../common/contexts/GlobalContext";
import { siteLinks } from "../data/siteData";

const Sidebar = () => {
  const { theme, toggleSidebar, setSidebar, toggleTheme } = useGlobal();

  return (
    <div className="sidebar">
      <div className="sidebar_container">
        {/* sidebar brand */}
        <button
          className="text-xl font-medium bg-blue-600 hover:bg-blue-700 text-white sidebar_item"
          onClick={toggleSidebar}
        >
          <div className="px-2 py-2 bg-slate-900 rounded inline-block">
            <BsWallet className="icon " />
          </div>
          <span className="title">Track Taka</span>
        </button>

        {/* sidebar links */}
        <ul className="sidebar_links mt-10">
          {siteLinks &&
            siteLinks.length &&
            siteLinks.map((item) => (
              <li key={item.id} onClick={() => setSidebar(false)} className="">
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `sidebar_links_item  ${isActive ? "active" : ""}`
                  }
                  end
                >
                  <item.icon className={`icon`} />

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
          <span
            className={` px-2 py-2 bg-blue-600 text-white rounded inline-block`}
          >
            {theme == "dark" ? (
              <BsSun className="icon" />
            ) : (
              <BsMoonFill className="icon" />
            )}
          </span>

          <span className="title">light theme</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
