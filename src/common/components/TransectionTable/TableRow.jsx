import React from "react";
import { BsPen, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";

const TableRow = ({
  title = null,
  amount = null,
  category = null,
  type = null,
  date = null,
  id = null,
  isSelected = false,
  handleSelect = () => {},
  handleDelete = async () => {},
  isLoading = false,
  isInteractive,
}) => {
  return (
    <tr className={`table_body_row ${type}`}>
      {isInteractive ? (
        <td className="text-center">
          <input type="checkbox" checked={isSelected} onChange={handleSelect} />
        </td>
      ) : null}
      <td>{title}</td>
      <td>{amount}</td>
      <td>{category}</td>
      <td>
        <span className="transection_type">{type}</span>
      </td>
      <td>{date}</td>
      {isInteractive ? (
        <td
          className={`flex items-center gap-1 justify-center ${
            isLoading ? "cursor-not-allowed pointer-events-none" : ""
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
      ) : null}
    </tr>
  );
};

export default TableRow;
