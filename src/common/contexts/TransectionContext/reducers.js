import {
  CLEAR_TRANSECTION,
  CREATE_TRANSECTION,
  DELETE_TRANSECTION,
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
      const isUniqueId = prevState.data?.some(
        (item) => item.id != newTransection.id
      );
      // if transection id is not unique
      if (!isUniqueId) return { ...prevState };
      // push data to the state
      prevState.data.push(newTransection);
      // sort transections
      const sortedPrevStateData = sortTransections(prevState.data);
      // update state with sorted data
      prevState.data = sortedPrevStateData;

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
      return { incomes: 0, expenses: 0, data: [] };
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
        return true;
      });
      // store data
      const transectionData = [...prevState.data, ...newData];
      // update sorted data to the state
      prevState.data = [...sortTransections(transectionData)];

      return { ...prevState };
    }

    default: {
      return { ...state };
    }
  }
};
