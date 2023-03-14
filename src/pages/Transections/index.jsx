import React from "react";
import MonthFilter from "../../common/components/MonthFilter";
import StatCards from "../../common/components/StatCards";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransection } from "../../common/contexts/transectionContext";

const Transections = () => {
  const { transections, transectionLoading } = useTransection();

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

      <StatCards />

      <TransectionTable className="mt-10" data={transections} />
    </>
  );
};

export default Transections;
