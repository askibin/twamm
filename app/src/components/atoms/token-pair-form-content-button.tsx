import * as Styled from "./token-pair-form-content-button.styled";
import { ConnectWalletGuard } from "../organisms/wallet-guard";

export interface Props {
  disabled: boolean;
  scheduled?: boolean;
}

export default ({ disabled, scheduled }: Props) => {
  const text = scheduled ? "Schedule Order" : "Place Order";

  return (
    <ConnectWalletGuard append={false}>
      <Styled.ActionButton disabled={disabled} type="submit">
        {text}
      </Styled.ActionButton>
    </ConnectWalletGuard>
  );
};
