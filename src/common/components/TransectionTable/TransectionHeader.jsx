import React, { useState } from "react";
import {
  BsFunnel,
  BsSearch,
  BsThreeDotsVertical,
  BsTrash,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { downloadFile } from "../../../utilities/downloadFile";
import ImportFile from "../ImportFile";

const TransectionHeader = ({
  deleteAble = false,
  query = "",
  setQuery = () => {},
  handleDelete = () => {},
  handleFilter = () => {},
  tableData = {},

  loading = true,
  setLoading = () => {},
}) => {
  // dropdown
  const [dropdown, setDropdown] = useState(false);
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

        <div className="dropdown relative">
          <button
            className="btn btn-icon btn-success"
            onClick={() => setDropdown((prevState) => !prevState)}
          >
            <BsThreeDotsVertical />
          </button>

          <ul
            className={`dropdown_list  flex-col absolute bg-white border-gray-300 dark:bg-slate-700 text-right min-w-[200px] right-0 z-[999] p-2 mt-2 rounded border dark:border-gray-600 ${
              dropdown ? "flex" : "hidden"
            } `}
          >
            <li>
              <Link
                onClick={() => setDropdown(false)}
                className={`px-2 py-1.5 block dark:hover:bg-slate-600 rounded-sm`}
                to={"/transections/create"}
              >
                Add new
              </Link>
            </li>
            <li>
              <a
                onClick={() => setDropdown(false)}
                className={`px-2 py-1.5 block dark:hover:bg-slate-600 rounded-sm ${
                  loading ? "pointer-events-none" : ""
                }`}
                href={downloadFile(tableData)}
                download={`track-taka-${new Date().getTime()}.json`}
              >
                Export Transections
              </a>
            </li>
            <li>
              <label
                htmlFor="json"
                className={`px-2 py-1.5 block dark:hover:bg-slate-600 rounded-sm w-full cursor-pointer  ${
                  loading ? "pointer-events-none" : ""
                }`}
              >
                Import Transections
                <ImportFile id={"json"} setLoading={setLoading} />
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransectionHeader;
