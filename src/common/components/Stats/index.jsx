import React from "react";
import {
  BsCurrencyDollar,
  BsGraphDown,
  BsGraphUp,
  BsWallet,
} from "react-icons/bs";
import StatCard from "./Card";

const Stats = ({
  transections = [],
  className = "",
  showWallet = true,
  showIncome = true,
  showExpenses = true,
  showTotal = true,
}) => {
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
    <div
      className={`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 ${className}`}
    >
      {showWallet ? (
        <StatCard
          type="savings"
          title="wallet"
          amount={incomes - expenses}
          icon={BsWallet}
        />
      ) : null}

      {showIncome ? (
        <StatCard
          type="income"
          title="income"
          amount={incomes}
          icon={BsGraphUp}
        />
      ) : null}

      {showExpenses ? (
        <StatCard
          type="expense"
          title="expense"
          amount={expenses}
          icon={BsGraphDown}
        />
      ) : null}
      {showTotal ? (
        <StatCard
          type="transections"
          title="transections"
          amount={incomes + expenses}
          icon={BsCurrencyDollar}
        />
      ) : null}
    </div>
  );
};

export default Stats;
