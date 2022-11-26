import { Field, Form, Formik } from "formik";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Createable from "react-select/creatable";
import * as Yup from "yup";
import { useTransection } from "../../common/contexts/TransectionContext";

const transectionSchema = Yup.object({
  title: Yup.string().max(30).required(),
  amount: Yup.number().required().min(1),
  type: Yup.string().oneOf(["expense", "income"]).required(),
  category: Yup.string().min(2).max(10).required(),
  date: Yup.date().required(),
});

const TransectionForm = ({ mode = "create", initialValues, handleSubmit }) => {
  // router navigate
  const navigate = useNavigate();

  // transection context
  const { categories } = useTransection();

  // custom select options
  const customOptions = useMemo(
    () =>
      categories && categories.length
        ? categories.map((item) => ({ label: item, value: item }))
        : [],
    [categories]
  );

  return (
    <Formik
      initialValues={initialValues}
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
              <Createable
                name="category"
                value={
                  values.category
                    ? {
                        label: values.category,
                        value: values.category,
                      }
                    : ""
                }
                placeholder="select or create category"
                options={customOptions}
                className
                onChange={(cate) =>
                  setFieldValue("category", cate.value.toLowerCase())
                }
                classNamePrefix="custom-select"
              ></Createable>
              <p className="input_error">{errors.category}</p>
            </div>

            <div className="input_group" data-invalid={!!errors.date}>
              <label htmlFor="date">Transection Date</label>
              <Field
                type="date"
                name="date"
                id="date"
                className="form-input input"
                value={values.date}
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
                  mode == "create" ? "btn-success" : "btn-warning"
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
