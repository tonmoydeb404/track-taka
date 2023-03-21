import React, { useState } from "react";
import { toast } from "react-hot-toast";
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
  small = false,
}) => {
  // transection context
  const { deleteTransection, deleteTransections } = useTransection();

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
    try {
      setIsLoading(true);
      const promise = deleteTransections(selectedRows);
      await toast.promise(promise, {
        loading: "deleting selected transection...",
        success: "selected transections deleted",
        error: "something wents to wrong!",
      });
      // reset states
      clearSelect();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // delete specific row
  const deleteRow = async (id) => {
    try {
      setIsLoading(true);
      const promise = deleteTransection(id);
      await toast.promise(promise, {
        loading: "deleting transection...",
        success: "transection deleted",
        error: "something wents to wrong!",
      });

      // reset states
      removeSelect(id);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
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
        <table
          className={`w-full dark:border-gray-700 border ${
            small ? "table-sm" : ""
          }`}
        >
          <TableHeader
            toggleAllSelect={toggleAllSelect}
            isAllSelected={isAllSelected}
            isInteractive={isInteractive}
          />
          <TableBody
            tableData={small ? tableData.slice(0, 10) : tableData}
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
