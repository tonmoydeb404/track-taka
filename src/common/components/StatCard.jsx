import React from "react";

const StatCard = ({ type, title, amount, icon }) => {
  return (
    <div
      className={`flex items-center gap-4 bg-white px-4 py-3.5 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded ${type}`}
    >
      <div className="">
        <i
          className={`bi bi-${icon} px-3 py-2.5 text-3xl text-white rounded icon`}
        ></i>
      </div>
      <div className="flex flex-col">
        <h2 className="text-base lowercase text-slate-600 dark:text-slate-300">
          {title}
        </h2>
        <h3 className="text-3xl font-bold">{amount}</h3>
      </div>
    </div>
  );
};

export default StatCard;
