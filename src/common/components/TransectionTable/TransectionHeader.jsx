import React from "react";
import { BsFunnel, BsPlusLg, BsSearch, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";

const TransectionHeader = ({
  deleteAble = false,
  query = "",
  setQuery = () => {},
  handleDelete = () => {},
  handleFilter = () => {},
  loading = true,
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
          className="form-input"
        />

        <BsSearch className=" icon"></BsSearch>
      </div>

      {/* <!-- table actions --> */}
      <div
        className={`transection_head_actions ${
          loading ? "cursor-not-allowed" : ""
        }`}
      >
        <Link
          className={`btn btn-icon btn-success`}
          to={"/transections/create"}
        >
          <BsPlusLg />
        </Link>
        <button
          className={`btn btn-icon btn-warning ${
            loading ? "pointer-events-none" : ""
          }`}
          onClick={handleFilter}
        >
          <BsFunnel />
        </button>

        {deleteAble && (
          <button
            disabled={loading}
            className={`btn btn-icon btn-danger font-medium ${
              loading ? "pointer-events-none" : ""
            }`}
            onClick={handleDelete}
          >
            <BsTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransectionHeader;
