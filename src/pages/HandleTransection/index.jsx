import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import { useTransection } from "../../common/contexts/TransectionContext";
import TransectionForm from "./TransectionForm";

const HandleTransection = ({ mode }) => {
  // router hooks
  const navigate = useNavigate();
  const { id } = useParams();
  // transection context
  const { transections, createTransection, updateTransection } =
    useTransection();
  // app states
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
  const handleSubmit = async (values) => {
    try {
      if (mode == "create") {
        const promise = createTransection(values);
        await toast.promise(promise, {
          loading: "creating transection...",
          success: "transection created successfully",
          error: "error: transection not created",
        });
      } else if (mode == "edit") {
        const promise = updateTransection({ ...setDefState, ...values });
        await toast.promise(promise, {
          loading: "editing transection...",
          success: "transection edited successfully",
          error: "error: transection not edited",
        });
      }
      navigate("/transections");
    } catch (error) {
      console.error(error);
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
