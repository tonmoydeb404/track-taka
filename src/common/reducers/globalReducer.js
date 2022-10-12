// initial values
export const globalValues = {
  darkTheme: false,
  sidebar: false,
};

// global reducer Types
const actions = {
  TOGGLE_THEME: "TOGGLE_THEME",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
};

// global reducer
export const globalReducer = (state = initalValues, { type, payload }) => {
  switch (type) {
    case actions.TOGGLE_SIDEBAR: {
      const sidebar = !state.sidebar;
      return { ...state, sidebar };
    }
    case actions.TOGGLE_THEME: {
      const darkTheme = !state.darkTheme;
      return { ...state, darkTheme };
    }
    default:
      return state;
  }
};

export const { TOGGLE_THEME, TOGGLE_SIDEBAR } = actions;
