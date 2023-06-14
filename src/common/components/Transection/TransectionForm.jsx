import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import * as Yup from "yup";
import categories from "../../../data/categories.json";
import FormDatePicker from "./FormDatePicker";

const transectionSchema = Yup.object({
  title: Yup.string().max(30).required(),
  amount: Yup.number().required().min(1),
  type: Yup.string().oneOf(["expense", "income"]).required(),
  category: Yup.string().min(2).max(10).required(),
  date: Yup.date().required(),
});

const TransectionForm = ({ mode = "CREATE", initialValues, handleSubmit }) => {
  // router navigate
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    amount: 0,
    type: "",
    category: "",
    date: new Date(),
  });

  useEffect(() => {
    if (mode === "UPDATE") {
      const state = {};
      if (initialValues?.title) state.title = initialValues.title;
      if (initialValues?.amount) state.amount = initialValues.amount;
      if (initialValues?.type) state.type = initialValues.type;
      if (initialValues?.category) state.category = initialValues.category;
      if (initialValues?.date) state.date = new Date(initialValues.date);

      setFormValues((p) => ({ ...p, ...state }));
    }
  }, [mode, initialValues]);

  const categoryOptions = Object.values(categories);

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSubmit}
      validationSchema={transectionSchema}
      enableReinitialize={true}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, values, resetForm, submitForm, setFieldValue }) => {
        return (
          <Form className="w-full lg:w-[500px] flex flex-col gap-4">
            <div className="input_group" data-invalid={!!errors.title}>
              <label htmlFor="title">Transection Title</label>
              <Field
                type="text"
                name="title"
                id="title"
                value={values.title}
                className="form-input input"
              />
              <p className="input_error">{errors.title}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.amount}>
              <label htmlFor="amount">Transection Amount</label>
              <Field
                type="number"
                name="amount"
                id="amount"
                value={values.amount}
                className="form-input input"
              />
              <p className="input_error">{errors.amount}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.type}>
              <label htmlFor="type">Transection Type</label>

              <Field
                as="select"
                name="type"
                id="type"
                value={values.type}
                className="form-select input"
              >
                <option disabled value={""}>
                  select transection type
                </option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Field>
              <p className="input_error">{errors.type}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.category}>
              <label htmlFor="category">Transection Category</label>
              <ReactSelect
                name="category"
                id="category"
                value={
                  values.category && categories[values.category]
                    ? categories[values.category]
                    : ""
                }
                menuShouldScrollIntoView
                menuPlacement="top"
                placeholder="select or search category"
                options={categoryOptions}
                onChange={(cate) =>
                  setFieldValue("category", cate.value.toLowerCase())
                }
                classNamePrefix="custom-select"
              />
              <p className="input_error">{errors.category}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.date}>
              <label htmlFor="date">Transection Date</label>
              <FormDatePicker
                date={values.date}
                setDate={(d) => setFieldValue("date", d)}
              />
              <p className="input_error">{errors.date}</p>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
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

              <button
                className={`btn ${
                  mode == "CREATE" ? "btn-success" : "btn-warning"
                }`}
                type="submit"
              >
                {mode}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TransectionForm;
