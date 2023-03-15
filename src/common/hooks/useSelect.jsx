import { useState } from "react";

const useSelect = (data = [], target) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (value) => {
    if (selected.includes(value)) {
      // remove from selected
      setSelected((prev) => prev.filter((item) => item !== value));
    } else {
      // add to the selected
      setSelected((prev) => [...prev, value]);
    }
  };
  const removeSelect = (value) => {
    setSelected((prev) => prev.filter((item) => item !== value));
  };
  const removeMultiple = (valueArr = []) => {
    setSelected((prev) => prev.filter((item) => !valueArr.includes(item)));
  };
  const clearSelect = () => setSelected([]);
  const allSelect = () => {
    const allSelected = [...selected];
    data.forEach((item) => {
      const value = item?.[target];
      if (!value || selected.includes(value)) return;

      allSelected.push(value);
    });
    setSelected(allSelected);
  };

  return {
    selected,
    removeMultiple,
    removeSelect,
    toggleSelect,
    clearSelect,
    allSelect,
  };
};

export default useSelect;
