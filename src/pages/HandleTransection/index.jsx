import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import uuid from "react-uuid";
import { useTransection } from "../../common/contexts/TransectionContext";
import TransectionForm from "./TransectionForm";

const HandleTransection = ({ mode }) => {
  const { transections, createTransection, updateTransection } =
    useTransection();
  const { id } = useParams();

  const [defState, setDefState] = useState({
    id: uuid(),
    title: "",
    amount: 0,
    type: "",
    category: "",
    date: "",
  });

  // handle default data
  useEffect(() => {
    if (mode == "edit" && id) {
      const targetedState = transections.find((item) => item.id == id);

      if (targetedState !== undefined) {
        setDefState({ ...targetedState });
      }
    }

    return () => {
      setDefState({
        title: "",
        amount: 0,
        type: "",
        category: "",
        date: "",
      });
    };
  }, [mode, id, transections]);

  // handle submit
  const handleSubmit = (values) => {
    if (mode == "create") {
      createTransection(values);
      toast.success("new transection created successfully");
    } else if (mode == "edit") {
      updateTransection({ ...setDefState, ...values });
      toast.success("transection edited successfully");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">
          {mode == "edit" ? "Edit" : "New"} Transection
        </h2>
      </div>

      <div className="mt-10">
        <TransectionForm
          mode={mode}
          initialValues={defState}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default HandleTransection;
