import React from "react";
import { BsPen, BsTrash } from "react-icons/bs";
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
  handleDelete = async () => {},
  loading = false,
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
          loading ? "cursor-not-allowed pointer-events-none" : ""
        }`}
      >
        <Link
          className={`btn btn-icon btn-primary btn-sm`}
          to={`/transections/edit/${id}`}
        >
          <BsPen />
        </Link>

        <button
          className={`btn btn-icon btn-danger btn-sm`}
          onClick={handleDelete}
        >
          <BsTrash />
        </button>
      </td>
    </tr>
  );
};

export default TransectionTR;
