import React from "react";
import { BsChatLeftQuote } from "react-icons/bs";

const FeedbackCard = ({ name = "", text = "" }) => {
  return (
    <div className="flex flex-col relative p-4 sm:p-5 bg-white shadow border dark:bg-slate-800 dark:border-slate-700 rounded-md gap-1">
      <div className="absolute right-5 top-5 text-7xl opacity-10">
        <BsChatLeftQuote />
      </div>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="opacity-80">{text}</p>
    </div>
  );
};

export default FeedbackCard;
