import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TokenPairCards from "./token-pair-cards";
import { useTokenPair } from "../../hooks/use-token-pair";

export default () => {
  const { data, isValidating } = useTokenPair();

  console.log("data", data, isValidating);

  return (
    <Box>
      <Typography pb={2} color="white" variant="h4">
        Performing Pairs
      </Typography>
      <TokenPairCards data={data} />
    </Box>
  );
};
