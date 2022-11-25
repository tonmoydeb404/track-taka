import React from "react";
import toast from "react-hot-toast";
import readJSON from "../../utilities/readJSON";
import { useTransection } from "../contexts/TransectionContext";

const ImportFile = ({ id = null }) => {
  // transection context
  const { insertTransection } = useTransection();

  const handleFile = async (e) => {
    try {
      const response = await readJSON(e.target?.files[0]);
      // check for file data
      if (response?.data?.length) {
        insertTransection(response.data);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    // reset input state
    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        id={id}
        className="hidden"
        accept="application/JSON"
        onChange={handleFile}
      />
    </>
  );
};

export default ImportFile;
