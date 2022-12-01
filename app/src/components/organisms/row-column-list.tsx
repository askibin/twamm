import type { FC, ReactNode } from "react";
import type {
  GridCellParams,
  GridColDef,
  GridSortItem,
  GridValidRowModel,
} from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useCallback, useMemo } from "react";

import Loading from "../atoms/loading";
import SortControl from "../atoms/sort-control";
import useBreakpoints from "../../hooks/use-breakpoints";
import * as Styled from "./row-column-list.styled";

export interface SortItem extends GridSortItem {}

export type SortModel = SortItem[];

export type RowId = string | number;

export type SelectionModel = RowId[];

// lightweight version of GridValueGetterParams
export interface ValueGetterParams<V = any> {
  row: RowModel;
  value: V;
}

export interface ComparatorFn<V, R = any> {
  (v1: V, v2: V, row1: R, row2: R): number;
}

export interface ColDef<V = any>
  extends Omit<GridColDef<RowModel>, "sortComparator"> {
  xs: number;
  md: number;
  sortComparator?: ComparatorFn<V, RowModel>;
  valueGetter?: (params: ValueGetterParams) => V;
}

export interface RowModel extends GridValidRowModel {
  id: string;
}

export interface RowParams<R extends RowModel = any> {
  id: RowId;
  row: R;
  columns: ColDef[];
}

type RenderCellDef<T = ReactNode> = (
  arg0: Pick<GridCellParams, "row" | "value">
) => T;

export interface Props {
  // columnVisibilityModel: {};
  checkboxSelection: boolean; // eslint-disable-line react/no-unused-prop-types
  columns: ColDef[];
  error: Error | undefined;
  filterColumnField?: string; // eslint-disable-line react/no-unused-prop-types
  loading: boolean;
  onRowClick: (arg0: RowParams) => void;
  onSelectionModelChange?: (arg0: SelectionModel) => void;
  onSortModelChange: (arg0: SortModel) => void;
  rows: RowModel[];
  selectionModel?: SelectionModel;
  sortModel: SortModel;
  updating: boolean;
}

const Header = (props: {
  columns: Props["columns"];
  onSortModelChange: Props["onSortModelChange"];
  sortModel: Props["sortModel"];
}) => {
  const onSortModelChange = (sortModelItem: SortItem) =>
    props.onSortModelChange(!sortModelItem.sort ? [] : [sortModelItem]);

  console.log(props.error);

  return (
    <List>
      <Styled.HeaderRow>
        <Styled.Columns container spacing={1}>
          {props.columns.map((c) => (
            <Styled.Column item key={c.field} xs={c.xs} md={c.md}>
              <Styled.ColumnInner>{c.headerName}</Styled.ColumnInner>
              {!c.sortable ? null : (
                <SortControl
                  sort={
                    c.field === props.sortModel[0].field
                      ? props.sortModel[0].sort
                      : undefined
                  }
                  field={c.field}
                  onChange={onSortModelChange}
                />
              )}
            </Styled.Column>
          ))}
        </Styled.Columns>
      </Styled.HeaderRow>
    </List>
  );
};

function sortComparator<T>(a: T, b: T) {
  if (a === b) return 0;

  return ((c, d) => (c < d ? -1 : 1))(a, b);
}

const Rows = (props: {
  columns: Props["columns"];
  onRowClick: Props["onRowClick"];
  rows: Props["rows"];
  sortModel: Props["sortModel"];
}) => {
  const rows = useMemo(() => {
    const [sortItem] = props.sortModel;

    if (!sortItem?.sort) return props.rows;

    const targetColumn = props.columns.find((c) => c.field === sortItem.field);

    return props.rows.sort((a, b) => {
      const aValue = a[sortItem.field];
      const bValue = b[sortItem.field];

      if (targetColumn?.sortComparator)
        return targetColumn.sortComparator(aValue, bValue, a, b);

      return sortItem.sort === "asc"
        ? sortComparator(aValue, bValue)
        : sortComparator(bValue, aValue);
    });
  }, [props]);

  return (
    <List>
      {rows.map((r) => (
        <Styled.Row
          key={r.id}
          onClick={() =>
            props.onRowClick({
              id: r.id,
              row: r,
              columns: props.columns,
            })
          }
        >
          <Styled.RowCells container spacing={1}>
            {props.columns.map((c) => {
              const name = c.field;
              const key = name;
              const val = r[name];
              const CellComponent = c.renderCell as
                | RenderCellDef<ReturnType<FC>>
                | undefined;

              const value = c.valueGetter
                ? c.valueGetter({ row: r, value: val })
                : val;

              return CellComponent ? (
                <Styled.RowCell item key={key} xs={c.xs} md={c.md}>
                  <CellComponent row={r} value={value} />
                </Styled.RowCell>
              ) : (
                <Styled.RowCell item key={key} xs={c.xs} md={c.md}>
                  {value}
                </Styled.RowCell>
              );
            })}
          </Styled.RowCells>
        </Styled.Row>
      ))}
    </List>
  );
};

export default (props: Props) => {
  const { isMobile } = useBreakpoints();

  if (props.updating) {
    console.log(props);
  }

  const onSortModelChange = useCallback(
    (sortModel: SortModel) => {
      props.onSortModelChange(sortModel);
    },
    [props]
  );

  const columns = useMemo(
    () => (isMobile ? props.columns.filter((c) => !c.hideable) : props.columns),
    [isMobile, props.columns]
  );

  return (
    <Box>
      {isMobile ? null : (
        <Header
          columns={props.columns}
          onSortModelChange={onSortModelChange}
          sortModel={props.sortModel}
        />
      )}
      {props.loading ? (
        <Loading />
      ) : (
        <Rows
          columns={columns}
          onRowClick={props.onRowClick}
          rows={props.rows}
          sortModel={props.sortModel}
        />
      )}
    </Box>
  );
};
