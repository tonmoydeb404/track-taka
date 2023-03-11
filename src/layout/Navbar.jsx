import React from "react";
import { BsList, BsMoonFill, BsSun } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useGlobal } from "../common/contexts/GlobalContext";

const Navbar = () => {
  const { theme, toggleSidebar, toggleTheme } = useGlobal();

  return (
    <div className="bg-white items-center gap-4 px-5 py-2 md:px-10 sticky top-0 left-0 w-full hidden sm:flex lg:hidden border-b border-b-gray-200 dark:border-b-gray-700 dark:bg-slate-800 z-[1000]">
      <button
        className="px-2.5 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 duration-300 text-lg text-white rounded"
        onClick={toggleSidebar}
      >
        <BsList />
      </button>

      <Link to="/" className="text-xl font-medium">
        Track Taka
      </Link>

      <button
        className="px-2.5 py-2.5 bg-slate-800/10 text-lg ml-auto rounded-full hover:bg-slate-800 hover:text-white duration-300"
        onClick={toggleTheme}
      >
        {theme == "dark" ? <BsSun /> : <BsMoonFill />}
      </button>
    </div>
  );
};

export default Navbar;
