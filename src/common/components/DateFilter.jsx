import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendarCheck } from "react-icons/bs";

const DateFilter = ({
  filterType,
  onFilterTypeChange = () => {},
  filterDate,
  onFilterDateChange = () => {},
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      {/* drop down button */}
      <button
        className="btn bg-white border-gray-200 border dark:border-gray-700  dark:bg-slate-800 gap-2 group "
        onClick={() => setShow((prev) => !prev)}
      >
        <BsCalendarCheck />
        <span>
          {filterType === "NONE" ? "all" : ""}
          {filterType === "MONTH"
            ? filterDate?.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            : ""}
          {filterType === "YEAR" ? filterDate?.getFullYear() : ""}
        </span>
      </button>

      {/* dropdown menu */}
      <div
        className={`flex flex-col p-3 bg-white border-gray-200 dark:border-gray-700  border dark:bg-slate-800 gap-3 rounded min-w-[250px] absolute left-0 sm:right-0 sm:left-auto top-full mt-2 z-[100] ${
          !show ? "hidden" : ""
        }`}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="filterType" className="text-xs uppercase opacity-50">
            filter by
          </label>
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            className="form-select rounded-sm dark:bg-slate-700"
            id="filterType"
          >
            <option value="NONE">none</option>
            <option value="MONTH">month</option>
            <option value="YEAR">year</option>
          </select>
        </div>

        <div
          className={
            !["MONTH", "YEAR"].includes(filterType)
              ? "hidden"
              : "grid place-items-center"
          }
        >
          <ReactDatePicker
            showPopperArrow={false}
            inline
            showMonthDropdown
            showMonthYearPicker={filterType === "MONTH"}
            showYearPicker={filterType === "YEAR"}
            selected={filterDate}
            onChange={onFilterDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
