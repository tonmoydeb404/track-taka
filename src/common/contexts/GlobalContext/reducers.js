import {
  SET_AUTOBACKUP,
  SET_AUTOBACKUP_DURATION,
  SET_AUTOBACKUP_LAST_TIME,
  SET_MONTH_FILTER,
  SET_SIDEBAR,
  SET_THEME,
  TOGGLE_MONTH_FILTER,
  TOGGLE_SIDEBAR,
  TOGGLE_THEME,
} from "./types";

// global initial state
export const initialState = {
  theme: "dark",
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

// global context reducer
export const reducers = (state = initialState, { type, payload }) => {
  switch (type) {
    // sidebar reducers
    case TOGGLE_SIDEBAR: {
      const sidebar = !state.sidebar;
      return { ...state, sidebar };
    }
    case SET_SIDEBAR: {
      const sidebar = payload.sidebar;
      return { ...state, sidebar };
    }
    // theme reducers
    case TOGGLE_THEME: {
      const theme = state.theme == "dark" ? "light" : "dark";
      return { ...state, theme };
    }
    case SET_THEME: {
      const theme = payload.theme;
      return { ...state, theme };
    }
    // month filter reducer
    case SET_MONTH_FILTER: {
      const prevState = { ...state };
      prevState.monthFilter.value = payload.month;
      return { ...prevState };
    }
    case TOGGLE_MONTH_FILTER: {
      const prevState = { ...state };
      prevState.monthFilter.enable = !prevState.monthFilter.enable;
      return { ...prevState };
    }
    // AUTO BACKUP
    case SET_AUTOBACKUP: {
      const prevState = { ...state };
      if (payload.autoBackup) {
        // set auto backup
        prevState.autoBackup.enable = payload.autoBackup;
      }
      return { ...prevState };
    }
    case SET_AUTOBACKUP_DURATION: {
      const prevState = { ...state };
      if (payload.duration) {
        // set auto backup duration
        prevState.autoBackup.duration = payload.duration;
      }
      return { ...prevState };
    }
    case SET_AUTOBACKUP_LAST_TIME: {
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
