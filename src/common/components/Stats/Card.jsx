import React from "react";
import CountUp from "react-countup";

const StatCard = ({ type, title, amount, icon: Icon }) => {
  return (
    <div
      className={`flex items-center gap-4 bg-white px-4 py-3.5 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded ${type}`}
    >
      <div className="">
        <div className={`px-3 py-2.5 text-3xl text-white rounded icon`}>
          <Icon />
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-base lowercase text-slate-600 dark:text-slate-300">
          {title}
        </h2>
        <h3 className="text-3xl font-bold">
          <CountUp end={amount} duration={1} />
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
