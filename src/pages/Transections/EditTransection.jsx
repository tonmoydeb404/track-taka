import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import TransectionForm from "../../common/components/Transection/TransectionForm";
import { useTransection } from "../../common/contexts/transectionContext";

const EditTransection = () => {
  // router hooks
  const navigate = useNavigate();
  const { id } = useParams();
  // transection context
  const { transections, updateTransection } = useTransection();
  // app states
  const [defState, setDefState] = useState();

  // handle default data
  useEffect(() => {
    if (id && transections) {
      const targetedState = transections.find((item) => item.id == id);
      if (targetedState) {
        setDefState({ ...targetedState });
      }
    }
  }, [id, transections]);

  // handle submit
  const handleSubmit = async (values) => {
    try {
      const updated = { ...defState, ...values };
      const promise = updateTransection(updated);
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
          mode={"UPDATE"}
          initialValues={defState}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default EditTransection;
