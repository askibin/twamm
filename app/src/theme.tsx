import type { PaletteMode } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";
import { grey } from "@mui/material/colors";
import { lensPath, pipe, set, view } from "ramda";

// Temporary import theme from the separate package
// eslint-disable-next-line import/no-relative-packages
import { theme as kitTheme } from "../packages/material-kit-react/src/theme/index";

const THEME_OVERRIDES = {
  palette: {
    background: {
      default: "#121623",
      paper: "#181f2b",
    },
  },
};

const lensScrollbar = lensPath([
  "components",
  "MuiCssBaseline",
  "styleOverrides",
  "html",
]);
const getOverrides = (theme: Theme, mode: PaletteMode) => {
  const scrollbar = darkScrollbar(
    mode === "light"
      ? {
          track: grey[200],
          thumb: grey[400],
          active: grey[400],
        }
      : undefined
  );

  const setScrollbar = set(lensScrollbar, {
    ...scrollbar,
    scrollbarWidth: "thin", // 4 FF
  });

  return setScrollbar(theme);
};

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
  interface ColorOverrides {
    white: {
      600: true;
    };
  }
}

const lensBreakpoints = lensPath(["breakpoints", "values"]);

const getBreakpoints = (theme: Theme) => {
  const values = view(lensBreakpoints, theme);
  const setBreakpoints = set(lensBreakpoints, {
    ...values,
    mobile: 0,
    tablet: 640,
    laptop: 1024,
    desktop: 1200,
  });

  return setBreakpoints(theme);
};

const getPalette = (theme: Theme) => {
  const lensDefaultBackground = lensPath(["palette", "background"]);
  const setDefaultBackground = set(
    lensDefaultBackground,
    view(lensDefaultBackground, THEME_OVERRIDES)
  );

  return pipe(setDefaultBackground)(theme);
};

export const dark = getPalette(getBreakpoints(getOverrides(kitTheme, "dark")));

export default dark;
