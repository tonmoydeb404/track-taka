import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import uuid from "react-uuid";
import TransectionForm from "../../common/components/Transection/TransectionForm";
import { useTransection } from "../../common/contexts/transectionContext";

const EditTransection = ({ mode }) => {
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
    if (id) {
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
      const promise = updateTransection(defState.id, values);
      await toast.promise(promise, {
        loading: "editing transection...",
        success: "transection edited successfully",
        error: "error: transection not edited",
      });

      navigate("/transections");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Edit Transection</h2>
      </div>

      <div className="mt-10">
        <TransectionForm
          mode={"EDIT"}
          initialValues={defState}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default EditTransection;
