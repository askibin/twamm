import * as Styled from "./account-orders-details-control.styled";

export interface Props {
  expired: boolean;
  inactive: boolean;
  onClick: () => void;
}

export default ({ expired, inactive, onClick }: Props) => {
  const actionName =
    expired || inactive ? "Withdraw Liquidity" : "Cancel Order";

  return (
    <Styled.ControlButton variant="outlined" onClick={onClick}>
      {actionName}
    </Styled.ControlButton>
  );
};
