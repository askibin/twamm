import type { Theme } from "@mui/material/styles";
import { lensPath, set, view } from "ramda";

import getOverrides from "./overrides";

// eslint-disable-next-line arrow-body-style
export default (theme: Theme) => {
  const lens = lensPath(["components"]);
  // @ts-ignore
  return set(lens, view(lens, getOverrides(theme)), theme);
};
