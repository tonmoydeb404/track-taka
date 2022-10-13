// initial values
const initalValues = {
  theme: "light",
  sidebar: false,
  monthFilter: {
    enable: true,
    value: new Date().getTime(),
  },
};

// global reducer Types
const actions = {
  TOGGLE_THEME: "TOGGLE_THEME",
  SET_THEME: "SET_THEME",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  SET_MONTH_FILTER: "SET_MONTH_FILTER",
  TOGGLE_MONTH_FILTER: "TOGGLE_MONTH_FILTER",
};

// global reducer
const reducer = (state = initalValues, { type, payload }) => {
  switch (type) {
    case actions.TOGGLE_SIDEBAR: {
      const sidebar = !state.sidebar;
      return { ...state, sidebar };
    }
    case actions.TOGGLE_THEME: {
      const theme = state.theme == "dark" ? "light" : "dark";
      return { ...state, theme };
    }
    case actions.SET_THEME: {
      const theme = payload.theme;
      return { ...state, theme };
    }
    case actions.SET_MONTH_FILTER: {
      const prevState = { ...state };
      prevState.monthFilter.value = payload.month;
      return { ...prevState };
    }
    case actions.TOGGLE_MONTH_FILTER: {
      const prevState = { ...state };
      prevState.monthFilter.enable = !prevState.monthFilter.enable;
      return { ...prevState };
    }
    default:
      return state;
  }
};

export {
  reducer as globalReducer,
  actions as globalActions,
  initalValues as globalValues,
};
