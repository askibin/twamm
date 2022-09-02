import type { ListChildComponentProps } from "react-window";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { FixedSizeList } from "react-window";
import { Fragment, useMemo } from "react";

import { useBreakpoints } from "../../hooks/use-breakpoints";

export interface Props {
  className: string;
  coins: Record<string, { symbol: string; image: string; name: string }>;
}

export default ({ className, coins }: Props) => {
  const { isMobile } = useBreakpoints();

  const coinRecords = useMemo(() => {
    const values = Object.values(coins);

    return values;
  }, [coins]);

  return (
    <List dense={isMobile}>
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={coinRecords.length}
        overscanCount={5}
      >
        {({ index, style }: ListChildComponentProps) => (
          <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemIcon>
              <Avatar
                alt={coinRecords[index].symbol}
                src={coinRecords[index].image}
              ></Avatar>
            </ListItemIcon>
            <ListItemText
              primary={coinRecords[index].symbol.toUpperCase()}
              secondary={true ? "Secondary text" : null}
            />
          </ListItem>
        )}
      </FixedSizeList>
    </List>
  );
};
