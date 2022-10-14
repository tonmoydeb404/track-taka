// initial values
const initalValues = {
  theme: "light",
  sidebar: false,
  autoBackup: {
    enable: false,
    duration: 1,
    lastTime: null,
  },
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

  SET_AUTO_BACKUP: "SET_AUTO_BACKUP",
  SET_AUTO_BACKUP_DURATION: "SET_AUTO_BACKUP_DURATION",
  SET_AUTO_BACKUP_LASTIME: "SET_AUTO_BACKUP_LASTIME",
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

    // AUTO BACKUP
    case actions.SET_AUTO_BACKUP: {
      const prevState = { ...state };
      if (payload.autoBackup) {
        // set auto backup
        prevState.autoBackup.enable = payload.autoBackup;
      }
      return { ...prevState };
    }
    case actions.SET_AUTO_BACKUP_DURATION: {
      const prevState = { ...state };
      if (payload.duration) {
        // set auto backup duration
        prevState.autoBackup.duration = payload.duration;
      }
      return { ...prevState };
    }
    case actions.SET_AUTO_BACKUP_LASTIME: {
      const prevState = { ...state };
      if (payload.lastTime) {
        // set auto backup lastime backup
        prevState.autoBackup.lastTime = payload.lastTime;
      }
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
