import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useCallback, useState } from "react";
import { Form } from "react-final-form";

import * as Styled from "./token-pair-form.styled";
import InTokenField from "../molecules/in-token-field";
import styles from "./token-pair-form.module.css";
import TimeInterval from "../atoms/time-interval";
import TokenSelect from "../atoms/token-select";
import { useScheduleOrder } from "../../hooks/use-schedule-order";

export interface Props {
  tokenA?: string;
  tokenB?: string;
  tokenAImage?: string;
  tokenBImage?: string;
  tokenAValue?: number;
  tokenBValue?: number;
  onASelect: () => void;
  onBSelect: () => void;
}

export default ({
  tokenA,
  tokenB,
  tokenAImage,
  tokenBImage,
  onASelect,
  onBSelect,
}: Props) => {
  const [curToken, setCurToken] = useState<number>();
  const [isSubmitting, setSubmitting] = useState(false);

  const { execute } = useScheduleOrder();

  const onCoinSelect = useCallback(
    (symbol: string) => {
      console.log(curToken, symbol); // eslint-disable-line no-console
    },
    [curToken]
  );

  const onSubmit = useCallback(
    (e) => {
      // setSubmitting(true);

      execute();
    },
    [setSubmitting]
  );

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Styled.TokenLabelBox>You pay</Styled.TokenLabelBox>
          <InTokenField name={tokenA} src={tokenAImage} onSelect={onASelect} />
          <Styled.OperationImage>
            <SyncAltIcon />
          </Styled.OperationImage>
          <Styled.TokenLabelBox>You receive</Styled.TokenLabelBox>
          <Box pb={2}>
            <TokenSelect
              alt={tokenB}
              image={tokenBImage}
              label={tokenB}
              onClick={onBSelect}
            />
          </Box>
          <Box pb={2}>
            <TimeInterval
              info=""
              label="Schedule Order"
              values={[-1, 300, 800, 5600]}
            />
          </Box>
          <Box pb={2}>
            <TimeInterval
              info=""
              label="Execution Period"
              values={[300, 800, 5600]}
            />
          </Box>
          <Box className={styles.connectBox} sx={{ py: 2 }}>
            <Button
              type="submit"
              className={styles.connectWallet}
              disabled={isSubmitting}
            >
              Schedule
            </Button>
          </Box>
        </form>
      )}
    </Form>
  );
};
