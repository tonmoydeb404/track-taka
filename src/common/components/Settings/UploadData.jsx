import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";

const UploadData = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col gap-1">
      <div className="settings_item">
        <h3 className="settings_item_title">Upload data to server</h3>

        <button className="btn btn-icon btn-warning ml-auto">
          <BsCloudUpload />
        </button>
      </div>
      {showMessage ? <p className="text-xs">{message}</p> : null}
    </div>
  );
};

export default UploadData;
