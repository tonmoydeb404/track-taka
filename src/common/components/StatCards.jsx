import React from "react";
import { BsGraphDown, BsGraphUp, BsWallet } from "react-icons/bs";
import { useTransection } from "../contexts/transectionContext";
import StatCard from "./StatCard";

const StatCards = () => {
  const { transections } = useTransection();

  // total incomes
  const incomes =
    transections?.reduce((prev, current) => {
      if (current.type == "income") {
        return prev + current.amount;
      }
      return prev;
    }, 0) || 0;

  // total expenses
  const expenses =
    transections?.reduce((prev, current) => {
      if (current.type == "expense") {
        return prev + current.amount;
      }
      return prev;
    }, 0) || 0;
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
      <StatCard
        type="savings"
        title="wallet"
        amount={incomes - expenses}
        icon={BsWallet}
      />

      <StatCard
        type="income"
        title="income"
        amount={incomes}
        icon={BsGraphUp}
      />

      <StatCard
        type="expense"
        title="expense"
        amount={expenses}
        icon={BsGraphDown}
      />
    </div>
  );
};

export default StatCards;
