import React, { useMemo } from "react";
import MonthFilter from "../../common/components/MonthFilter";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransectionContext } from "../../common/contexts/transectionContext";

const Expenses = () => {
  const { filteredState: state } = useTransectionContext();

  const expensesData = useMemo(
    () => state.filter((item) => item.type == "expense"),
    [state]
  );

  return (
    <>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Expense</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <MonthFilter />
        </div>
      </div>

      <TransectionTable className="mt-10" data={expensesData} />
    </>
  );
};

export default Expenses;
