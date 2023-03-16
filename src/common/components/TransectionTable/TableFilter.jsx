import React from "react";
import { BsXLg } from "react-icons/bs";
import categories from "../../../data/categories.json";

const TransectionFilter = ({
  isOpen = false,
  close = () => {},
  filterCategories = [],
  filterSort = "DEFAULT",
  filterType = "ALL",
  setFilterSort = () => {},
  setFilterType = () => {},
  toggleFilterCategory = () => {},
}) => {
  const categoryOptions = Object.values(categories);

  return (
    <div
      className={`fixed z-[9999] top-0 right-0 h-full sm:w-auto ${
        isOpen ? "w-full" : "w-0"
      }`}
    >
      <div
        className={`flex flex-col bg-white dark:bg-slate-800 p-8 duration-300  h-full border-l border-l-gray-200 dark:border-l-gray-700 overflow-x-hidden overflow-y-auto ${
          isOpen ? "w-full sm:w-[300px]" : "w-0 px-0"
        }`}
      >
        {/* filter header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Filters</h2>
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={() => close(false)}
          >
            <BsXLg />
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-2">
          <label className="text-base font-medium">Transection Type:</label>
          <select
            className="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <label className="text-base font-medium">Sort By:</label>
          <select
            className="select"
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
          >
            <option value="Default">Default</option>
            <option value="AMOUNT_LOW_TO_HIGH">Amount Low To High</option>
            <option value="AMOUNT_HIGH_TO_LOW">Amount High To Low</option>
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <label className="text-base font-medium">Categories</label>
          <div className="flex flex-col gap-2">
            {categoryOptions?.length
              ? categoryOptions.map((item) => (
                  <label
                    htmlFor={item.value}
                    key={item.value}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="checkbox"
                      name={item.value}
                      id={item.value}
                      checked={filterCategories.includes(item.value)}
                      onChange={() => toggleFilterCategory(item.value)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransectionFilter;
