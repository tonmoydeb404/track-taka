import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../common/contexts/globalContext";

const Navbar = () => {
  const { theme, toggleSidebar, toggleTheme } = useGlobalContext();

  return (
    <div className="bg-white flex items-center gap-4 px-5 py-2 md:px-10 sticky top-0 left-0 w-full lg:hidden border-b border-b-gray-200">
      <button
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 duration-300 text-lg text-white rounded"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list"></i>
      </button>

      <Link to="/" className="text-xl font-medium">
        Track Taka
      </Link>

      <button
        className="px-3 py-1.5 bg-slate-800/10 text-lg ml-auto rounded-full hover:bg-slate-800 hover:text-white duration-300"
        onClick={toggleTheme}
      >
        <i
          className={`bi ${theme == "dark" ? "bi-sun-fill" : "bi-moon-fill"}`}
        ></i>
      </button>
    </div>
  );
};

export default Navbar;
