import { BN } from "@project-serum/anchor";
import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { assureAccountCreated } from "@twamm/client.js/lib/assure-account-created";
import { createTransferNativeTokenInstructions } from "@twamm/client.js";
import { findAddress } from "@twamm/client.js/lib/program";
import { findAssociatedTokenAddress } from "@twamm/client.js/lib/find-associated-token-address";
import { isNil } from "ramda";
import { Order } from "@twamm/client.js/lib/order";
import { OrderSide } from "@twamm/types/lib";
import { Pool } from "@twamm/client.js/lib/pool";
import { SplToken } from "@twamm/client.js/lib/spl-token";

import useProgram from "./use-program";
import useTxRunner from "../contexts/transaction-runner-context";
import { NEXT_PUBLIC_ENABLE_TX_SIMUL } from "../env";

export interface Params {
  amount: number;
  decimals: number;
  side: OrderSide;
  aMint: string;
  bMint: string;
  tif: number;
  nextPool: boolean;
  poolCounters: PoolCounter[];
  tifs: number[];
}

export default () => {
  const { program, provider } = useProgram();
  const { commit, setInfo } = useTxRunner();

  const findProgramAddress = findAddress(program);

  const pool = new Pool(program);
  const order = new Order(program, provider);

  const TOKEN_PROGRAM_ID = SplToken.getProgramId();

  const run = async function execute({
    aMint,
    amount,
    bMint,
    decimals,
    nextPool,
    poolCounters,
    side,
    tif,
    tifs,
  }: Params) {
    const transferAuthority = await findProgramAddress(
      "transfer_authority",
      []
    );

    const aMintPublicKey = new PublicKey(aMint);
    const bMintPublicKey = new PublicKey(bMint);

    const tokenPairAddress = await findProgramAddress("token_pair", [
      new PublicKey(aMint).toBuffer(),
      new PublicKey(bMint).toBuffer(),
    ]);

    const aCustody = await findAssociatedTokenAddress(
      transferAuthority,
      aMintPublicKey
    );

    const bCustody = await findAssociatedTokenAddress(
      transferAuthority,
      bMintPublicKey
    );

    const aWallet = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      aMintPublicKey
    );

    const bWallet = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      bMintPublicKey
    );

    let preInstructions = [
      await assureAccountCreated(provider, aMintPublicKey, aWallet),
      await assureAccountCreated(provider, bMintPublicKey, bWallet),
    ];

    const isSell = side === OrderSide.sell;
    const isBuy = side === OrderSide.buy;

    if (isSell)
      preInstructions = preInstructions.concat(
        await createTransferNativeTokenInstructions(
          provider,
          aMintPublicKey,
          aWallet,
          amount
        )
      );

    if (isBuy)
      preInstructions = preInstructions.concat(
        await createTransferNativeTokenInstructions(
          provider,
          bMintPublicKey,
          bWallet,
          amount
        )
      );

    const pre = preInstructions.filter(
      (i): i is TransactionInstruction => !isNil(i)
    );

    const index = tifs.indexOf(tif);
    if (index < 0) throw new Error("Invalid TIF");
    const counter = poolCounters[index];

    const orderParams = {
      side: side === OrderSide.sell ? { sell: {} } : { buy: {} },
      timeInForce: tif,
      amount: new BN(amount * 10 ** decimals),
    };

    const poolCounter = nextPool ? Number(counter) + 1 : counter;

    const targetOrder = await order.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      poolCounter
    );

    const currentPool = await pool.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      counter
    );
    const targetPool = await pool.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      poolCounter
    );

    const accounts = {
      owner: provider.wallet.publicKey,
      userAccountTokenA: aWallet,
      userAccountTokenB: bWallet,
      tokenPair: tokenPairAddress,
      custodyTokenA: aCustody,
      custodyTokenB: bCustody,
      order: targetOrder,
      currentPool,
      targetPool,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    const tx = program.methods
      .placeOrder(orderParams)
      .accounts(accounts)
      .preInstructions(pre);

    if (NEXT_PUBLIC_ENABLE_TX_SIMUL === "1") {
      setInfo("Simulating transaction...");

      const simResult = await tx.simulate().catch((e) => {
        console.error("Failed to simulate", e); // eslint-disable-line no-console
      });

      if (simResult) console.debug(simResult.raw, simResult.events); // eslint-disable-line no-console, max-len
    }

    setInfo("Executing the transaction...");

    const result = await tx.rpc().catch((e: Error) => {
      console.error(e); // eslint-disable-line no-console
      throw e;
    });

    return result;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      const result = await commit(run(params));

      return result;
    },
  };
};
