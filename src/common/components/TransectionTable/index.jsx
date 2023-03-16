import React, { useState } from "react";
import { useTransection } from "../../contexts/transectionContext";
import useSelect from "../../hooks/useSelect";
import useTransectionFilter from "../../hooks/useTransectionFilter";
import Stats from "../Stats";
import TableBody from "./TableBody";
import TransectionFilter from "./TableFilter";
import TableHeader from "./TableHeader";
import TransectionHeader from "./TableNav";

const TransectionTable = ({
  className = "",
  data = [],
  showStats = false,
  isInteractive = false,
}) => {
  // transection context
  const { deleteTransection } = useTransection();

  // filter states
  const {
    filteredData: tableData,
    filterCategories,
    filterSort,
    filterType,
    query,
    setFilterSort,
    setFilterType,
    setQuery,
    toggleFilterCategory,
  } = useTransectionFilter(data);
  const [showFilter, setShowFilter] = useState(false);

  // selected row states
  const {
    selected: selectedRows,
    clearSelect,
    removeSelect,
    toggleSelect,
    toggleAllSelect,
    isAllSelected,
  } = useSelect(tableData, "id");

  // transection loading
  const [isLoading, setIsLoading] = useState(false);

  // delete selected rows
  const deleteSelectedRows = async () => {
    setIsLoading(true);
    await deleteTransection(selectedRows);

    // reset states
    clearSelect();
    setIsLoading(false);
  };

  // delete specific row
  const deleteRow = async (id) => {
    setIsLoading(true);
    await deleteTransection([id]);

    // reset states
    removeSelect(id);
    setIsLoading(false);
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      {showStats ? (
        <Stats
          transections={tableData}
          className="mb-10"
          showWallet={filterType == "ALL"}
          showTotal={filterType == "ALL"}
          showExpenses={filterType !== "INCOME"}
          showIncome={filterType !== "EXPENSE"}
        />
      ) : null}

      {isInteractive ? (
        <TransectionHeader
          query={query}
          setQuery={setQuery}
          handleDelete={deleteSelectedRows}
          deleteAble={!!selectedRows.length}
          showFilter={() => setShowFilter(true)}
          isLoading={isLoading}
        />
      ) : null}

      <div className={`overflow-x-auto py-0`}>
        <table className="w-full dark:border-gray-700 border-b">
          <TableHeader
            toggleAllSelect={toggleAllSelect}
            isAllSelected={isAllSelected}
            isInteractive={isInteractive}
          />
          <TableBody
            tableData={tableData}
            isInteractive={isInteractive}
            selectedRows={selectedRows}
            handleRowDelete={deleteRow}
            handleRowSelect={toggleSelect}
            isLoading={isLoading}
          />
        </table>
      </div>

      {isInteractive ? (
        <TransectionFilter
          isOpen={showFilter}
          close={() => setShowFilter(false)}
          filterCategories={filterCategories}
          filterSort={filterSort}
          filterType={filterType}
          setFilterSort={setFilterSort}
          setFilterType={setFilterType}
          toggleFilterCategory={toggleFilterCategory}
        />
      ) : null}
    </div>
  );
};

export default TransectionTable;
