import React from "react";
import toast from "react-hot-toast";
import readJSON from "../../utilities/readJSON";
import { useTransection } from "../contexts/TransectionContext";

const ImportFile = ({ id = null, setLoading = () => {} }) => {
  // transection context
  const { insertTransection } = useTransection();

  const handleFile = async (e) => {
    try {
      setLoading(true);
      const response = await readJSON(e.target?.files[0]);
      // check for file data
      if (response?.data?.length) {
        const promise = insertTransection(response.data);
        await toast.promise(promise, {
          loading: "inserting data...",
          error: "error: cannot insert data",
          success: "transection inserted successfully",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
