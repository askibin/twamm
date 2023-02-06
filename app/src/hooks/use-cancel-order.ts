import { assureAccountCreated } from "@twamm/client.js/lib/assure-account-created";
import { BN } from "@project-serum/anchor";
import { createCloseNativeTokenAccountInstruction } from "@twamm/client.js/lib/create-close-native-token-account-instruction"; // eslint-disable-line max-len
import { isNil } from "ramda";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import { Transfer } from "@twamm/client.js/lib/transfer";

import Logger from "../utils/logger";
import useProgram from "./use-program";
import useTxRunner from "../contexts/transaction-runner-context";
import { NEXT_PUBLIC_ENABLE_TX_SIMUL } from "../env";

export default () => {
  const { provider, program } = useProgram();
  const { commit, setInfo } = useTxRunner();

  const transfer = new Transfer(program, provider);

  const TOKEN_PROGRAM_ID = SplToken.getProgramId();

  const logger = Logger();

  const run = async function execute({
    a: primary,
    amount: lpAmount,
    b: secondary,
    orderAddress,
    poolAddress,
  }: {
    a: PublicKey;
    amount: number;
    b: PublicKey;
    orderAddress: PublicKey;
    poolAddress: PublicKey;
  }) {
    const transferAccounts = await transfer.findTransferAccounts(
      primary,
      secondary
    );

    const preInstructions = [
      await assureAccountCreated(provider, primary, transferAccounts.aWallet),
      await assureAccountCreated(provider, secondary, transferAccounts.bWallet),
    ];

    const pre = preInstructions.filter(
      (i): i is TransactionInstruction => !isNil(i)
    );

    const postInstructions = [
      await createCloseNativeTokenAccountInstruction(
        primary,
        transferAccounts.aWallet,
        provider.wallet.publicKey,
        undefined
      ),
      await createCloseNativeTokenAccountInstruction(
        secondary,
        transferAccounts.bWallet,
        provider.wallet.publicKey,
        undefined
      ),
    ];

    const post = postInstructions.filter(
      (i): i is TransactionInstruction => !isNil(i)
    );

    const accounts = {
      payer: provider.wallet.publicKey,
      owner: provider.wallet.publicKey,
      userAccountTokenA: transferAccounts.aWallet,
      userAccountTokenB: transferAccounts.bWallet,
      tokenPair: transferAccounts.tokenPair,
      transferAuthority: transferAccounts.transferAuthority,
      custodyTokenA: transferAccounts.aCustody,
      custodyTokenB: transferAccounts.bCustody,
      order: orderAddress,
      pool: poolAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    const tx = program.methods
      .cancelOrder({
        lpAmount: new BN(lpAmount),
      })
      .accounts(accounts)
      .preInstructions(pre)
      .postInstructions(post);

    if (NEXT_PUBLIC_ENABLE_TX_SIMUL === "1") {
      setInfo("Simulating transaction...");

      const simResult = await tx.simulate().catch((e) => {
        logger.error(e, "Failed to simulate");
        if (e.simulationResponse?.logs) logger.debug(e.simulationResponse.logs);
      });

      if (simResult) {
        logger.debug(simResult.raw);
        logger.debug(simResult.events);
      }
    }

    setInfo("Executing the transaction...");

    const result = await tx.rpc().catch((e: Error) => {
      logger.error(e);
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
