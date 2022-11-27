import tailwindConfig from "tailwindcss/defaultConfig";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

export const getBreakpointValue = (value) =>
  +fullConfig.theme.screens[value].slice(
    0,
    fullConfig.theme.screens[value].indexOf("px")
  );

const getBreakpoint = () => {
  let currentBreakpoint = null;
  let biggestBreakpointValue = 0;

  for (const breakpoint of Object.keys(fullConfig.theme.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint);
    if (
      breakpointValue > biggestBreakpointValue &&
      window.innerWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue;
      currentBreakpoint = breakpoint;
    }
  }

  return currentBreakpoint;
};

export default getBreakpoint;
