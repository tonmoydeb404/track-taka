import React from "react";

const TableHeader = ({
  isAllSelected,
  toggleAllSelect = () => {},
  isInteractive,
}) => {
  return (
    <thead className="table_header">
      <tr className="table_header_row">
        {isInteractive ? (
          <th className="table_header_item text-center px-1">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => toggleAllSelect(!e.target.checked)}
            />
          </th>
        ) : null}
        <th className="table_header_item">Title</th>
        <th className="table_header_item">Amount</th>
        <th className="table_header_item">Category</th>
        <th className="table_header_item">Type</th>
        <th className="table_header_item">Date</th>
        {isInteractive ? (
          <th className="table_header_item text-center">Actions</th>
        ) : null}
      </tr>
    </thead>
  );
};

export default TableHeader;
