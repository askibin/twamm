import * as Styled from "./token-pair-form-content-button.styled";
import { ConnectWalletGuard } from "../organisms/wallet-guard";

export interface Props {
  disabled: boolean;
  form?: string;
  scheduled?: boolean;
}

export default ({ disabled, form, scheduled }: Props) => {
  const text = scheduled ? "Schedule Order" : "Place Order";

  return (
    <ConnectWalletGuard append={false}>
      <Styled.ActionButton form={form} disabled={disabled} type="submit">
        {text}
      </Styled.ActionButton>
    </ConnectWalletGuard>
  );
};
