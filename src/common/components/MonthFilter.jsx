import React, { forwardRef, useState } from "react";
import ReactDatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsChevronDown } from "react-icons/bs";
import { useTransection } from "../contexts/transectionContext";

const MonthFilter = () => {
  const { transectionTime, setTransectionTime } = useTransection();
  const [key, setKey] = useState(false);

  const toggleFilter = () => {
    if (transectionTime === null) {
      setTransectionTime(Date.now());
    } else {
      setKey((prev) => !prev);
      setTransectionTime(null);
    }
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="btn bg-white border-gray-200 border dark:border-gray-700  dark:bg-slate-800 gap-2 group "
      onClick={onClick}
      ref={ref}
    >
      {transectionTime !== null ? value : "All Data"}
      <BsChevronDown className="group-focus:rotate-180 duration-300"></BsChevronDown>
    </button>
  ));

  const DatePickerContainer = ({ className, children }) => {
    return (
      <div className="flex flex-col p-3 bg-white border-gray-200 dark:border-gray-700  border dark:bg-slate-800 gap-3 rounded min-w-[240px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium ">enable monthly filter</span>

          <input
            type="checkbox"
            checked={!!transectionTime}
            onChange={toggleFilter}
          />
        </div>

        <div
          className={`relative ${
            transectionTime !== null ? "block" : "hidden"
          }`}
        >
          <CalendarContainer className={`${className}`}>
            <div className="relative">{children}</div>
          </CalendarContainer>
        </div>
      </div>
    );
  };

  return (
    <ReactDatePicker
      key={key}
      shouldCloseOnSelect={true}
      dateFormat="MM/yyyy"
      selected={transectionTime ? new Date(transectionTime) : null}
      onChange={(date) => setTransectionTime(date.getTime())}
      customInput={<CustomInput />}
      showMonthYearPicker
      calendarContainer={DatePickerContainer}
    ></ReactDatePicker>
  );
};

export default MonthFilter;
