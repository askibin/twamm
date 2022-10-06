import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";

const styledButton = styled(ToggleButton);

const BORDER_RADIUS = "40px";
const BORDER = "1px solid rgba(255, 255, 255, 0.2)";

export const ModeButtonGroup = styled(ToggleButtonGroup)`
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.04);
`;

// TODO: rewrite to fix types
// @ts-ignore
export const ModeButton = styledButton(({ selected }) => {
  const style = {
    color: selected ? "green" : "#fff",
    borderRadius: "40px",
    padding: "14px 34px",
    textTransform: "none",
    border: "1px solid transparent",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  if (!selected) return style;

  return {
    ...style,
    backgroundColor: "#121623 !important",
    border: BORDER,
    borderBottomLeftRadius: `${BORDER_RADIUS} !important`,
    borderBottomRightRadius: `${BORDER_RADIUS} !important`,
    borderLeft: `${BORDER} !important`,
    borderTopLeftRadius: `${BORDER_RADIUS} !important`,
    borderTopRightRadius: `${BORDER_RADIUS} !important`,
    color: `#fff !important`,
  };
});
