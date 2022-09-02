import { useMediaQuery, useTheme } from "@mui/material";

// eslint-disable-next-line import/prefer-default-export
export const useBreakpoints = () => {
  const { breakpoints } = useTheme();
  const { tablet } = breakpoints.values;

  const isMobile = useMediaQuery(breakpoints.down(tablet));

  return {
    isDesktop: !isMobile,
    isLaptop: !isMobile,
    isMobile,
    isTablet: !isMobile,
  };
};
