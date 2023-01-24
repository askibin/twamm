import { assureAccountCreated } from "@twamm/client.js/lib/assure-account-created";
import { BN } from "@project-serum/anchor";
import { createCloseNativeTokenAccountInstruction } from "@twamm/client.js/lib/create-close-native-token-account-instruction"; // eslint-disable-line max-len
import { findAddress } from "@twamm/client.js/lib/program";
import { findAssociatedTokenAddress } from "@twamm/client.js";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import { isNil } from "ramda";

import useProgram from "./use-program";
import useTxRunner from "../contexts/transaction-runner-context";
import { NEXT_PUBLIC_ENABLE_TX_SIMUL } from "../env";

export default () => {
  const { provider, program } = useProgram();
  const { commit, setInfo } = useTxRunner();

  const findProgramAddress = findAddress(program);

  const TOKEN_PROGRAM_ID = SplToken.getProgramId();

  const run = async function execute({
    a: aMint,
    amount: lpAmount,
    b: bMint,
    orderAddress,
    poolAddress,
  }: {
    a: PublicKey;
    amount: number;
    b: PublicKey;
    orderAddress: PublicKey;
    poolAddress: PublicKey;
  }) {
    const transferAuthority = await findProgramAddress(
      "transfer_authority",
      []
    );

    const tokenPairAddress = await findProgramAddress("token_pair", [
      new PublicKey(aMint).toBuffer(),
      new PublicKey(bMint).toBuffer(),
    ]);

    const aCustody = await findAssociatedTokenAddress(
      transferAuthority,
      aMint,
      TOKEN_PROGRAM_ID
    );

    const bCustody = await findAssociatedTokenAddress(
      transferAuthority,
      bMint,
      TOKEN_PROGRAM_ID
    );

    const aWallet = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      aMint
    );

    const bWallet = await findAssociatedTokenAddress(
      provider.wallet.publicKey,
      bMint
    );

    const preInstructions = [
      await assureAccountCreated(provider, aMint, aWallet),
      await assureAccountCreated(provider, bMint, bWallet),
    ];

    const pre = preInstructions.filter(
      (i): i is TransactionInstruction => !isNil(i)
    );

    const postInstructions = [
      await createCloseNativeTokenAccountInstruction(
        aMint,
        aWallet,
        provider.wallet.publicKey,
        undefined
      ),
      await createCloseNativeTokenAccountInstruction(
        bMint,
        bWallet,
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
      userAccountTokenA: aWallet,
      userAccountTokenB: bWallet,
      tokenPair: tokenPairAddress,
      transferAuthority,
      custodyTokenA: aCustody,
      custodyTokenB: bCustody,
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
