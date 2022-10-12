import { Field, Form, Formik } from "formik";
import React from "react";
import DB from "../../data/constant.json";

const TransectionForm = ({ mode = "Create" }) => {
  return (
    <Formik
      initialValues={{ title: "", amount: 0, type: "", category: "", date: "" }}
    >
      {({ errors }) => (
        <Form className="w-full lg:w-[500px] flex flex-col gap-4">
          <div className="input_group">
            <label htmlFor="title">Transection Title</label>
            <Field
              type="text"
              name="title"
              id="title"
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
              className="form-select input"
              data-invalid={!!errors.type}
            >
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
              className="form-select input"
              data-invalid={!!errors.category}
            >
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
            <button className="btn btn-danger">Cancel</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TransectionForm;
