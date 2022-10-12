import React from "react";
import TransectionForm from "./TransectionForm";

const HandleTransection = ({ mode }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">New Transection</h2>
      </div>

      <div className="mt-10">
        <TransectionForm mode={mode} />
      </div>
    </>
  );
};

export default HandleTransection;
