import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TokenPairCards from "./token-pair-cards";
import { useTokenPairs } from "../../hooks/use-token-pairs";

export default () => {
  const data = useTokenPairs();

  console.log("pairs", data.data);

  return (
    <Box>
      <Typography pb={2} color="white" variant="h4">
        Performing Pairs
      </Typography>
      <TokenPairCards data={data.data}></TokenPairCards>
    </Box>
  );
};
