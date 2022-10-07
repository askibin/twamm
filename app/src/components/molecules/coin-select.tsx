import type { MouseEvent } from "react";
import type { ListChildComponentProps } from "react-window";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { FixedSizeList } from "react-window";
import { useMemo } from "react";

import styles from "./coin-select.module.css";
import { useBreakpoints } from "../../hooks/use-breakpoints";

export interface Props {
  coins: Record<string, { symbol: string; image: string; name: string }>;
  filterCoin?: string;
  onClick: (arg0: MouseEvent, arg1: string) => void;
}

export default ({ coins, filterCoin, onClick = () => {} }: Props) => {
  const { isMobile } = useBreakpoints();

  const coinRecords = useMemo(() => {
    const values = Object.values(coins);

    if (!filterCoin) return values;

    return values.filter(
      (coin) =>
        coin.name.toLowerCase().startsWith(filterCoin) ||
        coin.name.toLowerCase().includes(filterCoin) ||
        coin.symbol.toLowerCase().startsWith(filterCoin)
    );
  }, [coins, filterCoin]);

  return (
    <List className={styles.coins} dense={isMobile}>
      <FixedSizeList
        height={400}
        width="100%"
        itemSize={56}
        itemCount={coinRecords.length}
        overscanCount={5}
      >
        {({ index, style }: ListChildComponentProps) => (
          <ListItem
            className={styles.coinItem}
            component="div"
            disablePadding
            key={index}
            onClick={(e: MouseEvent) => onClick(e, coinRecords[index].symbol)}
            style={style}
          >
            <ListItemIcon>
              <Avatar
                alt={coinRecords[index].symbol}
                src={coinRecords[index].image}
              >
                T
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={coinRecords[index].symbol.toUpperCase()}
              secondary={coinRecords[index].name}
            />
          </ListItem>
        )}
      </FixedSizeList>
    </List>
  );
};
