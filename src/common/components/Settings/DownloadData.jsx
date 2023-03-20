import React, { useState } from "react";
import { BsCloudDownload } from "react-icons/bs";

const DownloadData = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="flex flex-col gap-1">
      <div className="settings_item">
        <h3 className="settings_item_title">Download data from server</h3>

        <button className="btn btn-icon btn-success ml-auto">
          <BsCloudDownload />
        </button>
      </div>
      {showMessage ? <p className="text-xs">{message}</p> : null}
    </div>
  );
};

export default DownloadData;
