import { Popover, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
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
    <Popover as={"div"} className="relative">
      {/* drop down button */}
      <Popover.Button
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
      </Popover.Button>

      {/* dropdown menu */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          className={
            "absolute top-full mt-2 left-0 sm:right-0 sm:left-auto z-[1000]"
          }
        >
          <div
            className={`flex flex-col p-3 bg-white border-gray-200 dark:border-gray-700  border dark:bg-slate-800 gap-3 rounded min-w-[250px]`}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="filterType"
                className="text-xs uppercase opacity-50"
              >
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
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default DateFilter;
