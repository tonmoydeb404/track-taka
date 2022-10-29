import { defaultCategories } from "../../../data/siteData";
import {
  CLEAR_TRANSECTION,
  CREATE_CATEGORY,
  CREATE_TRANSECTION,
  DELETE_TRANSECTION,
  INSERT_CATEGORIES,
  INSERT_TRANSECTION,
  UPDATE_TRANSECTION,
} from "./types";

// sort transections
const sortTransections = (data) => {
  return [...data].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};

// initital state
export const initialState = {
  data: [
    // {
    //     id: "",
    //     title: "",
    //     amount: 0,
    //     type: "",
    //     category: "",
    //     date: ""
    // }
  ],
  categories: [...defaultCategories],
};

// reducers
export const reducers = (state = initialState, { type, payload }) => {
  // copy state
  let prevState = { ...state };

  switch (type) {
    case CREATE_TRANSECTION: {
      // new transection
      const newTransection = {
        id: payload.id,
        title: payload.title,
        amount: payload.amount,
        type: payload.type,
        category: payload.category,
        date: payload.date,
      };
      // check that transection id unique or not
      const isDuplicateId = prevState.data?.some(
        (item) => item.id == newTransection.id
      );

      // if transection id is not unique
      if (isDuplicateId) return { ...prevState };
      // push data to the state
      prevState.data.push(newTransection);
      // sort transections
      const sortedPrevStateData = sortTransections(prevState.data);
      // update state with sorted data
      prevState.data = sortedPrevStateData;

      // check for new category
      if (!prevState.categories.includes(newTransection.category))
        prevState.categories.push(newTransection.category);

      return { ...prevState };
    }

    case UPDATE_TRANSECTION: {
      // updated transection
      const updatedTransection = {
        id: payload.id,
        title: payload.title,
        amount: payload.amount,
        type: payload.type,
        category: payload.category,
        date: payload.date,
      };
      // find index of transection
      const index = prevState.data.findIndex(
        (transection) => transection.id == updatedTransection.id
      );
      // check index is valid or not
      if (index < 0) return { ...prevState };
      // update data to the state
      prevState.data[index] = updatedTransection;
      // sort transections
      const sortedPrevStateData = sortTransections(prevState.data);
      // update state with sorted data
      prevState.data = sortedPrevStateData;

      // update category
      if (!prevState.categories.includes(updatedTransection.category))
        prevState.categories.push(updatedTransection.category);

      return { ...prevState };
    }

    case DELETE_TRANSECTION: {
      const idList = payload.idList;

      // check the transection id list
      if (!idList && !idList.length) return { ...prevState };

      // filter transection list
      const filteredData = prevState.data.filter((transection) => {
        if (!idList.includes(transection.id)) return true;

        return false;
      });

      return { ...prevState, data: [...filteredData] };
    }

    case CLEAR_TRANSECTION: {
      return { ...initialState };
    }

    case INSERT_TRANSECTION: {
      let newData = [...payload.newData];
      // required props
      const reqProps = ["id", "title", "category", "amount", "type", "date"];
      // filter new transections data
      newData = [...newData].filter((data) => {
        // check required props
        const hasRequiredProps = reqProps.every((prop) =>
          data.hasOwnProperty(prop)
        );
        // check duplicate id
        const isDuplicate = prevState.data.some(
          (prevData) => prevData.id == data.id
        );
        // check data is valid or not
        if (!hasRequiredProps || isDuplicate) return false;

        // check for new category
        if (!prevState.categories.includes(data.category))
          prevState.categories.push(data.category);

        return true;
      });
      // store data
      const transectionData = [...prevState.data, ...newData];
      // update sorted data to the state
      prevState.data = [...sortTransections(transectionData)];

      return { ...prevState };
    }

    case CREATE_CATEGORY: {
      // new category
      const newCate = payload.category?.toLowerCase();
      // checking for category already exist or not
      if (!newCate && prevState.categories.includes(newCate))
        return { ...prevState };
      // push new cate to state
      prevState.categories.push(newCate);
      return { ...prevState };
    }

    case INSERT_CATEGORIES: {
      // new categories
      let newCates = payload.categories;
      // checking for category already exist or not
      if (!newCates && !newCates.length) return { ...prevState };
      // check for unique categories
      newCates = [...newCates].filter(
        (item) => !prevState.categories.includes(item)
      );
      // push new cate to state
      prevState.categories = [...prevState.categories, ...newCates];
      return { ...prevState };
    }

    default: {
      return { ...state };
    }
  }
};
