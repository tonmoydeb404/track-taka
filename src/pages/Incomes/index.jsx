import React, { useMemo } from "react";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransectionContext } from "../../common/contexts/transectionContext";

const Incomes = () => {
  const { state } = useTransectionContext();

  const incomesData = useMemo(
    () => state.filter((item) => item.type == "income"),
    [state]
  );

  return (
    <>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Incomes</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <select name="dateFilter" id="dateFilter" className="select">
            <option value="THIS_MONTH">This month</option>
            <option value="LAST_MONTH">Last month</option>
            <option value="ALL">All time</option>
          </select>
        </div>
      </div>

      <TransectionTable className="mt-10" data={incomesData} />
    </>
  );
};

export default Incomes;
