import { useMediaQuery, useTheme } from "@mui/material";

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
