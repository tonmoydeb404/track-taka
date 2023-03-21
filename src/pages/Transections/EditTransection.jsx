import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
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
      // modify date to time number
      const date = new Date(values.date).getTime();
      const updated = { ...defState, ...values, date };
      const promise = updateTransection(updated);
      await toast.promise(promise, {
        loading: "updating transection...",
        success: "transection updated successfully",
        error: "something wents to wrong",
      });
    } catch (error) {
      console.error(error);
    }
    navigate("/transections", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Edit Transections - Track Taka</title>
      </Helmet>
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
