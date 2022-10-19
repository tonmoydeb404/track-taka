import React from "react";
import MonthFilter from "../../common/components/MonthFilter";
import StatCard from "../../common/components/StatCard";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransectionContext } from "../../common/contexts/transectionContext";

const Transections = () => {
  const { filteredState: state } = useTransectionContext();

  const income = state.reduce((prev, current) => {
    if (current.type == "income") {
      return prev + current.amount;
    }
    return prev;
  }, 0);

  const expense = state.reduce((prev, current) => {
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
          type="income"
          title="income"
          amount={income}
          icon="graph-up-arrow"
        />

        <StatCard
          type="expense"
          title="expense"
          amount={expense}
          icon="graph-down-arrow"
        />
      </div>

      <TransectionTable className="mt-10" data={state} />
    </>
  );
};

export default Transections;
