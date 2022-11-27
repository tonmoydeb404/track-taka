import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTransection } from "../../contexts/TransectionContext";
import TransectionFilter from "./TransectionFilter";
import TransectionHeader from "./TransectionHeader";
import TransectionTH from "./TransectionTH";
import TransectionTR from "./TransectionTR";

const TransectionTable = ({ className = "", data = [] }) => {
  // app ref
  const txRef = useRef(null);

  // app states
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [query, setQuery] = useState("");

  // filter states
  const [viewFilter, setViewFilter] = useState(false);
  const [sortByFilter, setSortByFilter] = useState("Default");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [cateFilter, setCateFilter] = useState([]);

  // transection context
  const { deleteTransection } = useTransection();

  // transection loading
  const [loading, setLoading] = useState(false);

  // handle data filtering
  useEffect(() => {
    let filteredData = [...data];

    // searchFilter
    if (typeof query == "string" && query.length) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // category filter
    if (cateFilter && cateFilter.length) {
      filteredData = filteredData.filter((item) =>
        cateFilter.includes(item.category.toLowerCase())
      );
    }

    // sort filter
    if (sortByFilter == "AMOUNT_LOW_TO_HIGH") {
      filteredData = filteredData.sort((a, b) => a.amount - b.amount);
    } else if (sortByFilter == "AMOUNT_HIGH_TO_LOW") {
      filteredData = filteredData.sort((a, b) => b.amount - a.amount);
    }

    // type filter
    if (typeFilter == "INCOME") {
      filteredData = filteredData.filter((item) => item.type == "income");
    } else if (typeFilter == "EXPENSE") {
      filteredData = filteredData.filter((item) => item.type == "expense");
    }

    // update table data
    setTableData([...filteredData]);
  }, [query, data, sortByFilter, cateFilter, typeFilter]);

  //   handle individual select
  const handleSelect = (id, source = [], update = () => {}) => {
    const selectedItems = [...source];

    if (selectedItems.includes(id)) {
      selectedItems.splice(selectedItems.indexOf(id), 1);
    } else {
      selectedItems.push(id);
    }

    update([...selectedItems]);
  };

  // handle table row select
  const handleRowSelect = (id) =>
    handleSelect(id, selectedRows, setSelectedRows);

  // handle filter category select
  const handleCateSelect = (id) => handleSelect(id, cateFilter, setCateFilter);

  //   handle all select
  const handleAllSelect = (isSelected) => {
    let allIds = [];

    if (isSelected) {
      allIds = tableData.map((item) => item.id);
    }

    setSelectedRows([...allIds]);
  };

  // handle delete transection
  const handleDelete = async (id = [], clear = () => {}) => {
    // set loading true
    setLoading(true);
    const promise = deleteTransection(id);
    await toast.promise(promise, {
      loading: "deleting transection...",
      error: "error: cannot delete transection",
      success: "transection deleted successfully",
    });
    clear();
    // set loading false
    setLoading(false);
  };

  return (
    <div ref={txRef} className={className}>
      <TransectionHeader
        deleteAble={!!selectedRows.length}
        query={query}
        setQuery={setQuery}
        handleDelete={() =>
          handleDelete(selectedRows, () => handleAllSelect(false))
        }
        handleFilter={() => setViewFilter(true)}
        tableData={tableData}
        loading={loading}
        setLoading={setLoading}
      />

      <div className="overflow-x-auto mt-8">
        <table className="w-full border border-gray-200 dark:border-gray-700">
          <TransectionTH
            callBack={handleAllSelect}
            isAllSelected={
              tableData &&
              tableData.length &&
              selectedRows.length == tableData.length
            }
          />
          <tbody>
            {tableData && tableData.length ? (
              tableData.map((item) => (
                <TransectionTR
                  title={item.title}
                  type={item.type}
                  amount={item.amount}
                  category={item.category}
                  date={item.date}
                  id={item.id}
                  key={item.id}
                  handleSelect={() => handleRowSelect(item.id)}
                  isSelected={selectedRows.includes(item.id)}
                  handleDelete={() =>
                    handleDelete(
                      [item.id],
                      selectedRows.includes(item.id)
                        ? () => handleRowSelect(item.id)
                        : () => {}
                    )
                  }
                  loading={loading}
                  setLoading={setLoading}
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
        </table>
      </div>

      <TransectionFilter
        viewFilter={viewFilter}
        setViewFilter={setViewFilter}
        cateFilter={cateFilter}
        handleCateSelect={handleCateSelect}
        sortByFilter={sortByFilter}
        setSortByFilter={setSortByFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
    </div>
  );
};

export default TransectionTable;
