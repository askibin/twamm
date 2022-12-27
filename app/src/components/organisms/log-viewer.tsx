import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import * as Styled from "./log-viewer.styled";

export default ({ logs }: { logs: string[] | undefined }) => {
  if (!logs) return null;

  return (
    <Box pt={1}>
      <Styled.Logs dense>
        {logs.map((message: string, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <ListItem key={`log-${i}-${message}`}>
            <Styled.LogRecord primary={message} />
          </ListItem>
        ))}
      </Styled.Logs>
    </Box>
  );
};
