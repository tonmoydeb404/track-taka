import React from "react";

const TransectionTH = ({
  isAllSelected,
  selectAll = () => {},
  deselectAll = () => {},
}) => {
  const toggleSelect = (isSelected) => {
    if (isSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  return (
    <thead className="sticky top-0 left-0 w-full">
      <tr className="transection_head_row">
        <th>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => toggleSelect(!e.target.checked)}
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
