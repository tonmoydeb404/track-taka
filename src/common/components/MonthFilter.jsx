import React, { forwardRef } from "react";
import ReactDatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../contexts/globalContext";

const MonthFilter = ({}) => {
  const { monthFilter, setMonthFilter, toggleMonthFilter } = useGlobalContext();

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="btn dark:bg-slate-800 gap-2 group"
      onClick={onClick}
      ref={ref}
    >
      {monthFilter.enable ? value : "All Data"}
      <i className="bi bi-chevron-down group-focus:rotate-180 duration-300"></i>
    </button>
  ));

  const DatePickerContainer = ({ className, children }) => {
    return (
      <div className="flex flex-col p-3 bg-white dark:bg-slate-800 gap-3 rounded min-w-[200px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium ">enable monthly filter</span>

          <input
            type="checkbox"
            checked={monthFilter.enable}
            onChange={(e) => toggleMonthFilter(e.target.checked)}
          />
        </div>
        <div className={`relative ${monthFilter.enable ? "block" : "hidden"}`}>
          <CalendarContainer className={`${className}`}>
            <div className="relative">{children}</div>
          </CalendarContainer>
        </div>
      </div>
    );
  };

  return (
    <ReactDatePicker
      dateFormat="MM/yyyy"
      selected={new Date(monthFilter.value)}
      onChange={(date) => setMonthFilter(date.getTime())}
      customInput={<CustomInput />}
      showMonthYearPicker
      calendarContainer={DatePickerContainer}
    ></ReactDatePicker>
  );
};

export default MonthFilter;
