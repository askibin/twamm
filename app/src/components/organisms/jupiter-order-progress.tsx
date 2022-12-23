import JSBI from "jsbi";
import M from "easy-maybe/lib";
import { PublicKey } from "@solana/web3.js";
import { JupiterProvider, useJupiter } from "@jup-ag/react-hook";
import { useEffect } from "react";
import Loading from "../atoms/loading";
import useProgram from "../../hooks/use-program";
import { OrderSides } from "../../types/enums.d";
import useJupiterContext, {
  Provider,
} from "../../contexts/jupiter-connection-context";
import useSwapRoutes from "../../hooks/use-swap-routes-from-jup";
import useSwap from "../../hooks/use-swap-order-via-jupiter";

export interface Props {
  params: any;
}

const OrderProgress = (props: Params) => {
  const { amount, aMint, bMint, decimals, side } = props.params ?? {};

  const { ready, routeMap, tokenMap } = useJupiterContext();

  // console.log(123, routeMap, tokenMap);

  const [a, b] =
    OrderSides.defaultSide === side ? [aMint, bMint] : [bMint, aMint];

  const routes = useSwapRoutes({
    amount,
    inputMint: a,
    outputMint: b,
    decimals,
  });

  const { execute } = useSwap();
  //const jup = useJupiter({
  //amount: JSBI.BigInt(amount * 10 ** decimals),
  //inputMint: new PublicKey(a),
  //outputMint: new PublicKey(b),
  //slippageBps: 0.5, // use context slippage
  //debounceTime: 250,
  //});

  //console.log(jup);
  //

  useEffect(() => {
    (async () => {
      if (!routes.data) return;

      await execute(routes.data.routes);
    })();

    return () => {};
  }, [routes.data]);

  if (!ready) return <Loading />;

  return <>progress visuals</>;
};

export default (props: Props) => {
  const { provider } = useProgram();

  useEffect(() => {
    const invalidate = () => props.onUnmount();
    return invalidate;
  }, [props.onUnmount]);

  if (!props.params) return null;

  return (
    <Provider>
      <OrderProgress params={props.params} />
    </Provider>
  );
};
