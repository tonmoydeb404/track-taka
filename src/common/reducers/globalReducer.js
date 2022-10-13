// initial values
const initalValues = {
  theme: "light",
  sidebar: false,
};

// global reducer Types
const actions = {
  TOGGLE_THEME: "TOGGLE_THEME",
  SET_THEME: "SET_THEME",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
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
    default:
      return state;
  }
};

export {
  reducer as globalReducer,
  actions as globalActions,
  initalValues as globalValues,
};
