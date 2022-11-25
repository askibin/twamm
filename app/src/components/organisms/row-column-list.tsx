import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import useBreakpoints from "../../hooks/use-breakpoints";

export interface Props {
  data: any;
  rows: any;
  columns: any;
}

const Header = (props: { columns: any }) => {
  return <>columns</>;
};

const NarrowRows = (props: { rows: any }) => {
  return <>narrow</>;
};

const Rows = (props: { rows: any }) => {
  return <>rows</>;
};

export default (props: Props) => {
  const { isMobile } = useBreakpoints();

  console.log("props", props.data);

  return (
    <Box>
      {isMobile ? null : (
        <Grid container spacing={1}>
          <Header columns={props.columns} />
        </Grid>
      )}
      {isMobile ? <NarrowRows rows={props.rows} /> : <Rows rows={props.rows} />}
    </Box>
  );
};
