import React from "react";
import { BsFunnel, BsPlusLg, BsSearch, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";

const TransectionHeader = ({
  deleteAble = false,
  query = "",
  setQuery = () => {},
  handleDelete = () => {},
  showFilter = () => {},
  isLoading = true,
}) => {
  return (
    <div className="table_nav mb-5">
      {/* <!-- table search --> */}
      <div className="table_nav_search">
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
      <div className={`table_nav_actions`}>
        <Link
          className={`btn btn-icon btn-success`}
          to={"/transections/create"}
          disabled={isLoading}
        >
          <BsPlusLg />
        </Link>
        <button
          disabled={isLoading}
          className={`btn btn-icon btn-warning`}
          onClick={showFilter}
        >
          <BsFunnel />
        </button>

        {deleteAble && (
          <button
            disabled={isLoading}
            className={`btn btn-icon btn-danger font-medium`}
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
