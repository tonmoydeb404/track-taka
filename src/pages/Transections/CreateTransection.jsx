import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import TransectionForm from "../../common/components/Transection/TransectionForm";
import { useTransection } from "../../common/contexts/TransectionContext";

const CreateTransection = () => {
  // router hooks
  const navigate = useNavigate();
  // transection context
  const { createTransection } = useTransection();

  // handle submit
  const handleSubmit = async (values) => {
    try {
      const promise = createTransection(values);
      await toast.promise(promise, {
        loading: "creating transection...",
        success: "transection created successfully",
        error: "error: transection not created",
      });

      navigate("/transections");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Create Transection</h2>
      </div>

      <div className="mt-10">
        <TransectionForm
          mode={"CREATE"}
          initialValues={{
            id: uuid(),
            title: "",
            amount: 0,
            type: "",
            category: "",
            date: "",
          }}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default CreateTransection;
