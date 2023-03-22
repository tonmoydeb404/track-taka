import React from "react";
import { toast } from "react-hot-toast";
import { BsCloudDownload } from "react-icons/bs";
import { useTransection } from "../../contexts/transectionContext";

const ImportTransections = () => {
  const { importTransections } = useTransection();

  const handleImport = async () => {
    const promise = importTransections();

    await toast.promise(promise, {
      loading: "importing transections...",
      success: "successfully imported transections",
      error: "cannot import transections",
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="settings_item">
        <h3 className="settings_item_title">Import data from server</h3>

        <button
          className="btn btn-icon btn-success ml-auto"
          onClick={handleImport}
        >
          <BsCloudDownload />
        </button>
      </div>
    </div>
  );
};

export default ImportTransections;
