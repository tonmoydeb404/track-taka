import React from "react";
import {
  BiCog,
  BiHomeAlt,
  BiMoney,
  BiMoon,
  BiPlusCircle,
  BiSun,
} from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useTheme } from "../common/contexts/themeContext";

const list = [
  {
    path: "/dashboard",
    icon: BiHomeAlt,
    title: "Dashboard",
  },
  {
    path: "/transections",
    icon: BiMoney,
    title: "All Transections",
  },
  {
    path: "/transections/create",
    icon: BiPlusCircle,
    title: "Create Transection",
  },
  {
    path: "/settings",
    icon: BiCog,
    title: "Settings",
  },
];

const MobileMenu = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="mobile-menu">
      <div className="mobile-menu_wrapper">
        {list.map((Item) => (
          <NavLink
            key={Item.path}
            to={Item.path}
            title={Item.title}
            className={`mobile-menu_item`}
            end
          >
            <Item.icon className="icon" />
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
