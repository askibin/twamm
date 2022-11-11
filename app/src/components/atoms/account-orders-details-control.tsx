import Button from "@mui/material/Button";

export interface Props {
  expired: boolean;
  inactive: boolean;
  onClick: () => void;
}

export default ({ expired, inactive, onClick }: Props) => {
  const actionName =
    expired || inactive ? "Withdraw Liquidity" : "Cancel Order";

  return (
    <Button variant="outlined" onClick={onClick}>
      {actionName}
    </Button>
  );
};
