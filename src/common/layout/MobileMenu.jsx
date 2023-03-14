import React from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import links from "../../data/links.json";
import GetIcon from "../components/GetIcon";
import { useTheme } from "../contexts/themeContext";

const MobileMenu = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="mobile-menu">
      <div className="mobile-menu_wrapper">
        {links.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            title={item.title}
            className={`mobile-menu_item`}
            end
          >
            <GetIcon name={item.icon} className="icon" />
          </NavLink>
        ))}

        <button className="mobile-menu_item" onClick={toggleTheme}>
          {theme === "dark" ? (
            <BiSun className="icon" />
          ) : (
            <BiMoon className="icon" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default MobileMenu;
