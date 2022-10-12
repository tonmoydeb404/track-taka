import React, { useState } from "react";

const TransectionTH = ({ callBack = () => {} }) => {
  const [selectAll, setSelectAll] = useState(false);

  return (
    <thead>
      <tr className="transection_head_row">
        <th>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => {
              setSelectAll(e.target.checked);
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
