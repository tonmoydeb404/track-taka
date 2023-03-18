import { useEffect, useState } from "react";

const useTransectionFilter = (transections) => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("ALL");
  const [sort, setSort] = useState("DEFAULT");
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");

  // handle data filtering
  useEffect(() => {
    if (transections && transections.length) {
      let filteredData = [...transections];

      // filter by query
      if (typeof query == "string" && query.length) {
        filteredData = filteredData.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      // filter by category
      if (categories && categories.length) {
        filteredData = filteredData.filter((item) =>
          categories.includes(item.category.toLowerCase())
        );
      }

      // sort transections
      switch (sort) {
        case "AMOUNT_LOW_TO_HIGH":
          filteredData = filteredData.sort((a, b) => a.amount - b.amount);
          break;
        case "AMOUNT_HIGH_TO_LOW":
          filteredData = filteredData.sort((a, b) => b.amount - a.amount);
          break;
        default:
          filteredData = filteredData.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          break;
      }

      // filter by type
      switch (type) {
        case "INCOME":
          filteredData = filteredData.filter((item) => item.type == "income");
          break;
        case "EXPENSE":
          filteredData = filteredData.filter((item) => item.type == "expense");
          break;
        default:
          break;
      }

      // update table data
      setData(filteredData);
    }

    // clean up
    return () => {
      setData([]);
    };
  }, [query, transections, sort, categories, type]);

  // toggle select category
  const toggleCategory = (value) => {
    if (categories.includes(value)) {
      // remove category when its already includes
      setCategories((prev) => prev.filter((item) => item !== value));
    } else {
      // add category
      setCategories((prev) => [...prev, value]);
    }
  };

  return {
    filteredData: data,
    filterType: type,
    filterSort: sort,
    filterCategories: categories,
    query,
    setQuery,
    setFilterType: setType,
    setFilterSort: setSort,
    toggleFilterCategory: toggleCategory,
  };
};

export default useTransectionFilter;
