import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsCloudUpload } from "react-icons/bs";
import { useTransection } from "../../contexts/transectionContext";
import SettingsModal from "./SettingsModal";

const ExportTransections = () => {
  const { exportTransections } = useTransection();
  const [showModal, setShowModal] = useState(false);

  const handleExport = async () => {
    setShowModal(false);
    const promise = exportTransections();
    await toast.promise(promise, {
      loading: "exporting transections...",
      success: "successfully exported transections",
      error: "cannot export transections",
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="settings_item">
          <h3 className="settings_item_title">Export transections to server</h3>

          <button
            className="btn btn-icon btn-warning ml-auto"
            onClick={() => setShowModal(true)}
          >
            <BsCloudUpload />
          </button>
        </div>
      </div>
      <SettingsModal
        isOpen={showModal}
        onAgree={handleExport}
        onDisagree={() => setShowModal(false)}
        onClose={() => setShowModal(false)}
        title="Export"
        description={
          "By exporting transections to the server will remove all the existing transecitons."
        }
        agreeText="Export"
        disagreeText="Cancel"
      />
    </>
  );
};

export default ExportTransections;
