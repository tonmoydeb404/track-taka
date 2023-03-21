import React from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import TransectionForm from "../../common/components/Transection/TransectionForm";
import { useTransection } from "../../common/contexts/transectionContext";

const TOAST = "CREATE_TOAST";

const CreateTransection = () => {
  // router hooks
  const navigate = useNavigate();
  // transection context
  const { createTransection } = useTransection();

  // handle submit
  const handleSubmit = async (values) => {
    try {
      // modify date to time number
      const date = new Date(values.date).getTime();
      const transection = {
        id: uuid(),
        title: values.title,
        category: values.category,
        type: values.type,
        amount: values.amount,
        date,
        createdAt: Date.now(),
      };
      const promise = createTransection(transection);
      await toast.promise(promise, {
        loading: "creating new transection",
        success: "new transection created",
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
        <title>Create Transection - Track Taka</title>
      </Helmet>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Create Transection</h2>
      </div>

      <div className="mt-10">
        <TransectionForm mode={"CREATE"} handleSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default CreateTransection;
