import React from "react";
import { Link } from "react-router-dom";

const TransectionHeader = ({
  deleteAble = false,
  query = "",
  setQuery = () => {},
  handleDelete = () => {},
  handleFilter = () => {},
}) => {
  return (
    <div className="transection_head">
      {/* <!-- table search --> */}
      <div className="transection_head_search">
        <input
          type="search"
          placeholder="search.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <i className="bi bi-search icon"></i>
      </div>

      {/* <!-- table actions --> */}
      <div className="transection_head_actions">
        <button className="btn btn-warning" onClick={handleFilter}>
          <i className="bi bi-funnel"></i>
        </button>

        <Link
          className="btn btn-success font-medium"
          to={"/transections/create"}
        >
          <i className="bi bi-plus"></i>
          <span className="hidden md:block">Add New</span>
        </Link>

        {deleteAble && (
          <button className="btn btn-danger font-medium" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
            <span className="hidden md:block">Delete Selected </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransectionHeader;
