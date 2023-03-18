import { useEffect, useState } from "react";

const useDateFilter = (transections) => {
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date());
  const [filterType, setFilterType] = useState("MONTH");

  // update filter date
  useEffect(() => {
    setFilterDate(new Date());
  }, [filterType]);

  // update filter data
  useEffect(() => {
    if (transections) {
      switch (filterType) {
        case "NONE":
          setData(transections);
          break;
        case "MONTH":
          setData(
            transections?.filter((t) => {
              const tDate = new Date(t.date);
              return (
                tDate.getMonth() === filterDate.getMonth() &&
                tDate.getFullYear() === filterDate.getFullYear()
              );
            })
          );
          break;
        case "YEAR":
          setData(
            transections.filter((t) => {
              const tDate = new Date(t.date);
              return tDate.getFullYear() === filterDate.getFullYear();
            })
          );
          break;
        default:
          break;
      }
    }
  }, [transections, filterDate]);

  return {
    filteredData: data,
    filterDate,
    filterType,
    setFilterDate,
    setFilterType,
  };
};

export default useDateFilter;
