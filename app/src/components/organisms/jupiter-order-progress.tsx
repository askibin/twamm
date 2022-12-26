import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useCallback, useMemo } from "react";
import M, { Extra } from "easy-maybe/lib";
import { OrderSide as OrderSides } from "@twamm/types/lib";
import Button from "../molecules/progress-button";
import useJupiter, { withCtx } from "../../contexts/jupiter-connection-context";
import useSwap from "../../hooks/use-swap-order-via-jupiter";
import useSwapRoutes from "../../hooks/use-swap-routes-from-jup";

function OrderProgress(props: {
  disabled: boolean;
  form?: string;
  params: {
    amount: number;
    aMint: string;
    bMint: string;
    decimals: number;
    side: OrderSides;
  };
  progress: boolean;
  validate: () => { [key: string]: Error };
}) {
  const { amount, aMint, bMint, decimals, side } = props.params ?? {};

  const { execute } = useSwap();
  const { ready } = useJupiter();

  const [a, b] =
    OrderSides.defaultSide === side ? [aMint, bMint] : [bMint, aMint];

  const routes = useSwapRoutes({
    amount,
    inputMint: a,
    outputMint: b,
    decimals,
  });

  const onClick = useCallback(async () => {
    if (!routes.data) throw new Error("Absent routes");
    const routesData = routes.data.routes;

    const data = await execute(routesData);

    console.log({ data });
  }, [execute, routes.data]);

  const loading = M.withDefault(
    true,
    M.andMap(
      ([c, d]) => !(c && d),
      Extra.combine2([M.of(routes.data), M.of(ready)])
    )
  );

  const errors = useMemo(() => props.validate(), [props.validate]);

  return (
    <>
      <Button
        disabled={loading || props.disabled}
        form={props.form}
        loading={loading || props.progress}
        onClick={onClick}
        text="Exchange"
      />
      {!errors ? null : (
        <Box pt={1}>
          <Alert severity="error">
            <>
              {[...Object.keys(errors)].map((key) => (
                <div key={key}>{errors[key].message}</div>
              ))}
            </>
          </Alert>
        </Box>
      )}
    </>
  );
}

export default withCtx(OrderProgress);
