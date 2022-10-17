import Container from "@mui/material/Container";

import ModeToggle from "../atoms/mode-toggle";
import AccountOrders from "../organisms/account-orders";
import Maybe from "../../types/maybe";
import * as Styled from "./orders.styled";
import { useOrders } from "../../hooks/use-orders";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => {
  const orders = useOrders();

  return (
    <Container>
      <Styled.ModeControl p={2}>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </Styled.ModeControl>
      <AccountOrders
        data={Maybe.of(orders.data)}
        error={Maybe.of(orders.error)}
        loading={orders.isLoading}
        updating={orders.isValidating}
      />
    </Container>
  );
};
