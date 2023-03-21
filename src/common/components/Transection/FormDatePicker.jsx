import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { BsCalendar2Event } from "react-icons/bs";

const FormDatePicker = ({ date, setDate }) => {
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="btn input bg-white border border-slate-600 dark:border-slate-500"
      onClick={onClick}
      ref={ref}
      type={"button"}
    >
      <BsCalendar2Event />
      {value}
    </button>
  ));
  return (
    <ReactDatePicker
      dateFormat="dd/MM/yyyy"
      selected={date}
      onChange={(d) => setDate(d)}
      customInput={<ExampleCustomInput />}
      showPopperArrow={false}
    />
  );
};

export default FormDatePicker;
