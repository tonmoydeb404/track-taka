import React, { useMemo } from "react";
import MonthFilter from "../../common/components/MonthFilter";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransectionContext } from "../../common/contexts/transectionContext";

const Incomes = () => {
  const { filteredState: state } = useTransectionContext();

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
          <MonthFilter />
        </div>
      </div>

      <TransectionTable className="mt-10" data={incomesData} />
    </>
  );
};

export default Incomes;
