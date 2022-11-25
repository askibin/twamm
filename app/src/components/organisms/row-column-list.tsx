import type { FC, ReactNode } from "react";
import type { GridColDef, GridCellParams } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useMemo } from "react";

import useBreakpoints from "../../hooks/use-breakpoints";
import * as Styled from "./row-column-list.styled";

export interface Props {
  columns: GridColDef[];
  columnVisibilityModel: {};
  rows: Array<{ id: string } | any>;
  updating: boolean;
}

type RenderCellDef<T = ReactNode> = (
  arg0: Pick<GridCellParams, "row" | "value">
) => T;

const Header = (props: { columns: Props["columns"] }) => (
  <List>
    <ListItem>
      <Grid container>
        {props.columns.map((c) => (
          <Grid item key={c.field}>
            {c.headerName}
          </Grid>
        ))}
      </Grid>
    </ListItem>
  </List>
);

const Rows = (props: { columns: Props["columns"]; rows: Props["rows"] }) => (
  <List>
    {props.rows.map((r) => (
      <ListItem key={r.id}>
        <Grid container>
          {props.columns.map((c) => {
            const name = c.field;
            const key = name;
            const CellComponent = c.renderCell as
              | RenderCellDef<ReturnType<FC>>
              | undefined;
            const value = r[name];

            return CellComponent ? (
              <Grid item key={key}>
                <CellComponent row={r} value={value} />
              </Grid>
            ) : (
              <Grid item key={key}>
                {String(value)}
              </Grid>
            );
          })}
        </Grid>
      </ListItem>
    ))}
  </List>
);

export default (props: Props) => {
  const { isMobile } = useBreakpoints();

  const columns = useMemo(
    () => (isMobile ? props.columns.filter((c) => !c.hideable) : props.columns),
    [isMobile, props.columns]
  );

  return (
    <Box>
      {isMobile ? null : (
        <Grid container spacing={1}>
          <Header columns={props.columns} />
        </Grid>
      )}
      <Rows columns={columns} rows={props.rows} />
    </Box>
  );
};
