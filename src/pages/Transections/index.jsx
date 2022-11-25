import React from "react";
import MonthFilter from "../../common/components/MonthFilter";
import StatCard from "../../common/components/StatCard";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransection } from "../../common/contexts/TransectionContext";

const Transections = () => {
  const { filteredTransections: transectionList } = useTransection();

  // total incomes
  const incomes = transectionList.reduce((prev, current) => {
    if (current.type == "income") {
      return prev + current.amount;
    }
    return prev;
  }, 0);

  // total expenses
  const expenses = transectionList.reduce((prev, current) => {
    if (current.type == "expense") {
      return prev + current.amount;
    }
    return prev;
  }, 0);

  return (
    <>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Transections</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <MonthFilter />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        <StatCard
          type="savings"
          title="wallet"
          amount={incomes - expenses}
          icon="wallet"
        />

        <StatCard
          type="income"
          title="income"
          amount={incomes}
          icon="graph-up-arrow"
        />

        <StatCard
          type="expense"
          title="expense"
          amount={expenses}
          icon="graph-down-arrow"
        />
      </div>

      <TransectionTable className="mt-10" data={transectionList} />
    </>
  );
};

export default Transections;
