import { BN } from "@project-serum/anchor";
import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assureAccountCreated } from "@twamm/client.js/lib/assure-account-created";
import { createTransferNativeTokenInstructions } from "@twamm/client.js";
import { findAssociatedTokenAddress } from "@twamm/client.js/lib/find-associated-token-address";
import { findAddress } from "@twamm/client.js/lib/program";
import { Order } from "@twamm/client.js/lib/order";
import { Pool } from "@twamm/client.js/lib/pool";
import { isNil } from "ramda";

import useProgram from "./use-program";
import useTxRunnerContext from "./use-transaction-runner-context";

export default () => {
  const { program, provider } = useProgram();
  const { commit } = useTxRunnerContext();

  const findProgramAddress = findAddress(program);

  const pool = new Pool(program);
  const order = new Order(program, provider);

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
  }: {
    amount: number;
    decimals: number;
    side: OrderType;
    aMint: string;
    bMint: string;
    tif: number;
    nextPool: boolean;
    poolCounters: PoolCounter[];
    tifs: number[];
  }) {
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

    const isSell = side === "sell";
    const isBuy = side === "buy";

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
      side: side === "sell" ? { sell: {} } : { buy: {} },
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

    const result = await program.methods
      .placeOrder(orderParams)
      .accounts({
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
      })
      .preInstructions(pre);
    // .rpc()
    // .catch((e: Error) => {
    // console.error(e); // eslint-disable-line no-console
    // throw e;
    // });

    console.log("res", result);

    return result;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      // @ts-ignore
      const result = await commit(run(params));

      return result;
    },
  };
};
