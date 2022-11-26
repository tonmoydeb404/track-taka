import React from "react";
import { Link } from "react-router-dom";

const TransectionTR = ({
  title = null,
  amount = null,
  category = null,
  type = null,
  date = null,
  id = null,
  isSelected = false,
  handleSelect = () => {},
  handleDelete = () => {},

  loading = false,
  setLoading = () => {},
}) => {
  return (
    <tr className={`transection_body_row ${type}`}>
      <td className="text-center">
        <input type="checkbox" checked={isSelected} onChange={handleSelect} />
      </td>
      <td className="">{title}</td>
      <td className="">{amount}</td>
      <td className="">{category}</td>
      <td>
        <span className="transection_type">{type}</span>
      </td>
      <td className="">{date}</td>
      <td
        className={`flex items-center gap-1 justify-center ${
          loading ? "cursor-not-allowed" : ""
        }`}
      >
        <Link
          className={`btn btn-primary btn-sm ${
            loading ? "pointer-events-none" : ""
          }`}
          to={`/transections/edit/${id}`}
        >
          <i className="bi bi-pen"></i>
        </Link>

        <button
          className={`btn btn-danger btn-sm ${
            loading ? "pointer-events-none" : ""
          }`}
          onClick={() => handleDelete(id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default TransectionTR;
