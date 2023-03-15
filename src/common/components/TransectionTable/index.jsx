import React, { useState } from "react";
import { useTransection } from "../../contexts/transectionContext";
import useSelect from "../../hooks/useSelect";
import useTransectionFilter from "../../hooks/useTransectionFilter";
import TransectionFilter from "./TransectionFilter";
import TransectionHeader from "./TransectionHeader";
import TransectionTH from "./TransectionTH";
import TransectionTR from "./TransectionTR";

const TransectionTable = ({
  className = "",
  data = [],
  control = false,
  footer = false,
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
    removeMultiple,
    allSelect,
    clearSelect,
    removeSelect,
    toggleSelect,
  } = useSelect(tableData, "id");
  // transection loading
  const [loading, setLoading] = useState(false);

  // delete selected rows
  const handleDeleteSelectedRow = async () => {
    setLoading(true);
    await deleteTransection(selectedRows);

    // reset states
    clearSelect();
    setLoading(false);
  };

  // delete specific row
  const handleDeleteRow = async (id) => {
    setLoading(true);
    await deleteTransection([id]);

    // reset states
    removeSelect(id);
    setLoading(false);
  };

  console.log(tableData);

  return (
    <div className={` overflow-hidden ${className}`}>
      {control ? (
        <TransectionHeader
          query={query}
          setQuery={setQuery}
          handleDelete={handleDeleteSelectedRow}
          deleteAble={!!selectedRows.length}
          handleFilter={() => setShowFilter(true)}
          loading={loading}
        />
      ) : null}

      <div
        className={`overflow-auto relative max-h-[400px] block py-0 ${
          control ? "mt-5" : ""
        }`}
      >
        <table className="w-full dark:border-gray-700 border-b">
          <TransectionTH
            selectAll={allSelect}
            deselectAll={clearSelect}
            isAllSelected={
              tableData?.length && selectedRows?.length === tableData?.length
            }
          />
          <tbody>
            {tableData && tableData.length ? (
              tableData.map((item) => (
                <TransectionTR
                  {...item}
                  key={item.id}
                  handleSelect={() => toggleSelect(item.id)}
                  isSelected={selectedRows.includes(item.id)}
                  handleDelete={async () => await handleDeleteRow(item.id)}
                  loading={loading}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  no transection to show <i className="bi bi-emoji-frown"></i>
                </td>
              </tr>
            )}
          </tbody>
          {footer ? (
            <tfoot className="sticky bottom-0">
              <tr className="transection_footer_row">
                <th></th>
                <th colSpan={1}>total transections:</th>
                <th colSpan={2}>
                  <span className="font-semibold">100</span>
                </th>
                <th colSpan={3}>
                  <span className="transection_type btn-success">100</span>
                  &nbsp;
                  <span className="transection_type btn-danger">100</span>
                </th>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      {control ? (
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
