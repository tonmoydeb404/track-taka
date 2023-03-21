import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsCloudUpload } from "react-icons/bs";
import { useTransection } from "../../contexts/transectionContext";

const ExportTransections = () => {
  const { exportTransections } = useTransection();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    const promise = exportTransections();

    await toast.promise(promise, {
      loading: "exporting transections...",
      success: "successfully exported transections",
      error: "cannot export transections",
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="settings_item">
        <h3 className="settings_item_title">Export transections to server</h3>

        <button
          className="btn btn-icon btn-warning ml-auto"
          onClick={handleExport}
        >
          <BsCloudUpload />
        </button>
      </div>
      {showMessage ? <p className="text-xs">{message}</p> : null}
    </div>
  );
};

export default ExportTransections;
