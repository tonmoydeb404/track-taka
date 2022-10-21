import React from "react";

const ConfirmCard = ({
  title = null,
  text = null,
  allowText = null,
  denyText = null,
  callBack = () => {},
}) => {
  return (
    <div className="confirm flex flex-col bg-white dark:bg-slate-700 p-4 gap-6 rounded border w-full border-gray-200 dark:border-gray-600">
      <div className="confirm_body">
        {title ? <h2 className="text-xl font-medium">{title}</h2> : ""}
        {text ? (
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-100">
            {text}
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="confirm_footer flex items-center justify-end gap-1">
        <button className="btn btn-success" onClick={() => callBack(true)}>
          {allowText || "Okay"}
        </button>
        <button className="btn btn-danger" onClick={() => callBack(false)}>
          {denyText || "Cancel"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmCard;
