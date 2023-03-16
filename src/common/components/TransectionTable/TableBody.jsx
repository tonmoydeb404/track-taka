import React from "react";
import TableRow from "./TableRow";

const TableBody = ({
  tableData = [],
  isLoading = true,
  selectedRows,
  handleRowSelect = () => {},
  handleRowDelete = async () => {},
  isInteractive,
}) => {
  return (
    <tbody>
      {tableData && tableData.length ? (
        tableData.map((item) => (
          <TableRow
            {...item}
            key={item.id}
            isLoading={isLoading}
            isSelected={selectedRows.includes(item.id)}
            isInteractive={isInteractive}
            handleSelect={() => handleRowSelect(item.id)}
            handleDelete={async () => await handleRowDelete(item.id)}
          />
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-5">
            no transection to show
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;
