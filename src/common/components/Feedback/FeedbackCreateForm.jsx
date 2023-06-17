import { Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { createFeedback } from "../../../helpers/feedbackHelpers";

const transectionSchema = Yup.object({
  name: Yup.string().max(30).required(),
  text: Yup.string().min(3).required(),
  email: Yup.string().email().required(),
});

const FeedbackCreateForm = ({
  className = "",
  onFormSubmit = () => {},
  onFormCancel = () => {},
}) => {
  const handleSubmit = async (feedback) => {
    onFormSubmit();
    await toast.promise(createFeedback(feedback), {
      loading: "Submitting feedback",
      error: "Cannot submit feedback",
      success: "Feedback submitted!",
    });
  };

  const handleCancel = () => {
    onFormCancel();
  };

  return (
    <Formik
      initialValues={{
        name: "",
        text: "",
        email: "",
      }}
      onSubmit={async (values) => await handleSubmit(values)}
      onReset={handleCancel}
      validationSchema={transectionSchema}
      enableReinitialize={true}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, values, resetForm }) => {
        return (
          <Form className={`w-full flex flex-col gap-4 ${className}`}>
            <div className="input_group" data-invalid={!!errors.name}>
              <label htmlFor="name">Your Name</label>
              <Field
                type="text"
                name="name"
                id="name"
                value={values.name}
                className="form-input input"
              />
              <p className="input_error">{errors.name}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.email}>
              <label htmlFor="email">Your Email</label>
              <Field
                type="text"
                name="email"
                id="email"
                value={values.email}
                className="form-input input"
              />
              <p className="input_error">{errors.email}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.text}>
              <label htmlFor="text">Your Feedback</label>
              <Field
                as="textarea"
                name="text"
                id="text"
                value={values.text}
                className="form-textarea input min-h-[100px]"
              />
              <p className="input_error">{errors.text}</p>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                className="btn btn-danger"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button className={`btn btn-success`} type="submit">
                Create
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FeedbackCreateForm;
