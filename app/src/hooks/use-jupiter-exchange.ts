import JSBI from "jsbi";
import { PublicKey } from "@solana/web3.js";
import { JupiterProvider, useJupiter } from "@jup-ag/react-hook";
import { OrderSides } from "../types/enums.d";

export interface Params {
  side: OrderType;
  amount: number;
  decimals: number;
  aMint: string;
  bMint: string;
}

export default () => {
  const run = async function execute(params: Params) {
    console.log(params);
    const { amount, aMint, bMint, decimals, side } = params;

    const [a, b] =
      OrderSides.defaultSide === side ? [aMint, bMint] : [bMint, aMint];

    //const jup = useJupiter({
    //amount: JSBI.BigInt(amount * 10 ** decimals),
    //inputMint: new PublicKey(a),
    //outputMint: new PublicKey(b),
    //slippageBps: 0.5, // use context slippage
    //debounceTime: 250,
    //});

    //console.log(jup);

    return null;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      const result = await run(params);

      return result;
    },
  };
};
