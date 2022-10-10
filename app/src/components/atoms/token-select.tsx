import type { MouseEvent } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import Popover from "@mui/material/Popover";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useState } from "react";

import * as Styled from "./token-select.styled";

export interface Props {
  alt?: string;
  disabled?: boolean;
  image?: string;
  label?: string;
  onClick: (e: MouseEvent) => void;
}

export default ({ alt, disabled = false, image, label, onClick }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Styled.TokenField
        direction="row"
        onClick={disabled ? handlePopoverOpen : onClick}
        disabled={disabled}
      >
        <Styled.TokenIcon alt={alt} src={image}>
          {disabled ? <CancelIcon /> : <QuestionMarkIcon />}
        </Styled.TokenIcon>
        <Styled.TokenName>{label ?? "-"}</Styled.TokenName>
        <Styled.TokenControl>
          <ArrowDropDownIcon />
        </Styled.TokenControl>
      </Styled.TokenField>
      {disabled && (
        <Popover
          anchorEl={anchorEl}
          open={open}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          sx={{
            pointerEvents: "none",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Box p={1}>Choose another token first</Box>
        </Popover>
      )}
    </Box>
  );
};
