import { useMediaQuery, useTheme } from "@mui/material";

// eslint-disable-next-line import/prefer-default-export
export const useBreakpoints = () => {
  const { breakpoints } = useTheme();
  const { desktop, tablet } = breakpoints.values;

  const isMobile = useMediaQuery(breakpoints.down(tablet));
  const isDesktop = useMediaQuery(breakpoints.up(desktop + 1));

  return {
    isDesktop,
    isLaptop: !isMobile,
    isMobile,
    isTablet: !isMobile,
  };
};
