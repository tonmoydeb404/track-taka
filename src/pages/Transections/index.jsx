import React from "react";
import { Helmet } from "react-helmet";
import DateFilter from "../../common/components/DateFilter";
import TransectionTable from "../../common/components/TransectionTable";
import { useTransection } from "../../common/contexts/transectionContext";
import useDateFilter from "../../common/hooks/useDateFilter";

const Transections = () => {
  const { transections } = useTransection();
  const { filterDate, filterType, filteredData, setFilterDate, setFilterType } =
    useDateFilter(transections);

  return (
    <>
      <Helmet>
        <title>Transections - Track Taka</title>
      </Helmet>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Transections</h2>

        {/* <!-- header actions --> */}
        <div className="flex items-center gap-2">
          <DateFilter
            filterDate={filterDate}
            filterType={filterType}
            onFilterDateChange={setFilterDate}
            onFilterTypeChange={setFilterType}
          />
        </div>
      </div>

      <TransectionTable
        className="mt-10"
        data={filteredData}
        isInteractive
        showStats
      />
    </>
  );
};

export default Transections;
