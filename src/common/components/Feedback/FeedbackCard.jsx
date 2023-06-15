import React from "react";
import { BsChatLeftQuote } from "react-icons/bs";

const FeedbackCard = ({ name = "", text = "" }) => {
  return (
    <div className="flex flex-col relative p-4 sm:p-5 bg-white shadow border dark:bg-slate-800 dark:border-slate-700 rounded-md gap-1 overflow-hidden">
      <div className="absolute right-3 top-3 lg:right-5 lg:top-5 text-7xl opacity-10">
        <BsChatLeftQuote />
      </div>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="opacity-80">{text}</p>
    </div>
  );
};

export const FeedbackCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col relative p-4 sm:p-5 bg-white shadow border dark:bg-slate-800 dark:border-slate-700 rounded-md gap-1">
        <div className="h-[20px] rounded max-w-[200px] dark:bg-slate-700 mb-3"></div>
        <div className="h-[12px] rounded w-[60%] dark:bg-slate-700 mb-0.5"></div>
        <div className="h-[12px] rounded w-[80%] dark:bg-slate-700 mb-0.5"></div>
        <div className="h-[12px] rounded w-[40%] dark:bg-slate-700"></div>
      </div>
    </div>
  );
};

export default FeedbackCard;
