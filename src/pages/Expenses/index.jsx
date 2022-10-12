import React, { useMemo } from "react";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransectionContext } from "../../common/contexts/transectionContext";

const Expenses = () => {
  const { state } = useTransectionContext();

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
          <select name="dateFilter" id="dateFilter" className="select">
            <option value="THIS_MONTH">This month</option>
            <option value="LAST_MONTH">Last month</option>
            <option value="ALL">All time</option>
          </select>
        </div>
      </div>

      <TransectionTable className="mt-10" data={expensesData} />
    </>
  );
};

export default Expenses;
