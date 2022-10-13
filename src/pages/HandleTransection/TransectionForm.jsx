import { Field, Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DB from "../../data/constant.json";

const transectionSchema = Yup.object({
  title: Yup.string().max(30).required(),
  amount: Yup.number().required().min(1),
  type: Yup.string().oneOf(["expense", "income"]).required(),
  category: Yup.string().oneOf(DB.categories).required(),
  date: Yup.date().required(),
});

const TransectionForm = ({ mode = "create", initialValues, handleSubmit }) => {
  // router navigate
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSubmit(values);
        navigate("/transections");
      }}
      validationSchema={transectionSchema}
      enableReinitialize={true}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, values, resetForm, submitForm }) => {
        return (
          <Form className="w-full lg:w-[500px] flex flex-col gap-4">
            <div className="input_group">
              <label htmlFor="title">Transection Title</label>
              <Field
                type="text"
                name="title"
                id="title"
                value={values.title}
                className="form-input input"
                data-invalid={!!errors.title}
              />
              <p className="input_error">{errors.title}</p>
            </div>
            <div className="input_group">
              <label htmlFor="amount">Transection Amount</label>
              <Field
                type="number"
                name="amount"
                id="amount"
                value={values.amount}
                className="form-input input"
                data-invalid={!!errors.amount}
              />
              <p className="input_error">{errors.amount}</p>
            </div>
            <div className="input_group">
              <label htmlFor="type">Transection Type</label>

              <Field
                as="select"
                name="type"
                id="type"
                value={values.type}
                className="form-select input"
                data-invalid={!!errors.type}
              >
                <option disabled value={""}>
                  select transection type
                </option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Field>
              <p className="input_error">{errors.type}</p>
            </div>
            <div className="input_group">
              <label htmlFor="category">Transection Category</label>
              <Field
                as="select"
                name="category"
                id="category"
                value={values.category}
                className="form-select input"
                data-invalid={!!errors.category}
              >
                <option disabled value={""}>
                  select transection category
                </option>
                {DB.categories &&
                  DB.categories.length &&
                  DB.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </Field>
              <p className="input_error">{errors.category}</p>
            </div>
            <div className="input_group">
              <label htmlFor="date">Transection Date</label>
              <Field
                type="date"
                name="date"
                id="date"
                className="form-input input"
                value={values.date}
                data-invalid={!!errors.date}
              />
              <p className="input_error">{errors.date}</p>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                className={`btn ${
                  mode == "create" ? "btn-success" : "btn-warning"
                }`}
                type="submit"
              >
                {mode}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  resetForm();
                  navigate(-1);
                }}
              >
                Cancel
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TransectionForm;
