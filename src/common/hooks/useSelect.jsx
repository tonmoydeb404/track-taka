import { useMemo, useState } from "react";

const useSelect = (data = [], target) => {
  const [selected, setSelected] = useState([]);

  const isAllSelected = useMemo(() => {
    return (
      selected.length &&
      data.length &&
      data?.every((item) => selected.includes(item[target]))
    );
  }, [data, selected]);

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
  const toggleAllSelect = (isAll) => (isAll ? clearSelect() : allSelect());

  return {
    selected,
    isAllSelected,
    removeMultiple,
    removeSelect,
    toggleSelect,
    clearSelect,
    allSelect,
    toggleAllSelect,
  };
};

export default useSelect;
