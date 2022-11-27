import React from "react";

const TransectionTH = ({ callBack = () => {}, isAllSelected }) => {
  return (
    <thead>
      <tr className="transection_head_row">
        <th>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => {
              callBack(e.target.checked);
            }}
          />
        </th>
        <th>Title</th>
        <th>Amount</th>
        <th>Category</th>
        <th>Type</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default TransectionTH;
