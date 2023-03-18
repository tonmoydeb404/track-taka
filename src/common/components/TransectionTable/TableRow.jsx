import { format } from "date-fns";
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
        <td className="table_body_item text-center px-1">
          <input type="checkbox" checked={isSelected} onChange={handleSelect} />
        </td>
      ) : null}
      <td className="table_body_item">{title}</td>
      <td className="table_body_item">{amount}</td>
      <td className="table_body_item">{category}</td>
      <td className="table_body_item">
        <span className="transection_type">{type}</span>
      </td>
      <td className="table_body_item">{format(date, "dd/MM/yyyy")}</td>
      {isInteractive ? (
        <td
          className={`table_body_item flex items-center gap-1 justify-center ${
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
