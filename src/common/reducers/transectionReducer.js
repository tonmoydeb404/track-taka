import uuid from "react-uuid";

// initial state
const initialState = [
  {
    id: "#demo1",
    title: "demo income transection",
    category: "others",
    amount: 500,
    type: "income",
    date: "2022-10-11",
  },
  {
    id: "#demo2",
    title: "demo expense transection",
    category: "others",
    amount: 500,
    type: "expense",
    date: "2022-10-12",
  },
];

// reducer types
const types = {
  CREATE: "CREATE",
  EDIT: "EDIT",
  DELETE: "DELETE",
  INSERT: "INSERT",
};

// reducer
const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.CREATE: {
      if (payload) {
        const prevState = [...state];

        // push new data
        prevState.push({ id: uuid(), ...payload });

        // sort data
        prevState = prevState.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        return [...prevState];
      }
      return state;
    }

    case types.EDIT: {
      if (payload && payload.id) {
        const prevState = [...state];

        // find index of data
        const dataIndex = prevState.findIndex((data) => data.id == payload.id);

        // update data
        if (dataIndex >= 0) {
          prevState[dataIndex] = { ...payload };

          // sort data
          prevState = prevState.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });

          return [...prevState];
        }
      }
      return state;
    }

    case types.DELETE: {
      if (payload && payload.id) {
        const prevState = [...state];

        // delete data
        const filteredData = prevState.filter(
          (data) => !payload.id.includes(data.id)
        );

        return [...filteredData];
      }
      return state;
    }

    case types.INSERT: {
      if (payload && payload.data && payload.data.length) {
        const prevState = [...state];

        // required props
        const reqProps = ["id", "title", "category", "amount", "type", "date"];

        // filter data
        const filteredData = payload.data.filter((data) => {
          // check required props
          const hasRequiredProps = reqProps.every((prop) =>
            data.hasOwnProperty(prop)
          );

          return hasRequiredProps;
        });

        // concat state
        const newState = [...prevState, ...filteredData];

        // sort state
        newState = newState.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        return [...newState];
      }
      return state;
    }

    default: {
      return state;
    }
  }
};

export {
  reducer as transectionReducer,
  types as transectionTypes,
  initialState as transectionInitState,
};
