import { assureAccountCreated } from "@twamm/client.js/lib/assure-account-created";
import { BN } from "@project-serum/anchor";
import { createCloseNativeTokenAccountInstruction } from "@twamm/client.js/lib/create-close-native-token-account-instruction"; // eslint-disable-line max-len
import { findAddress } from "@twamm/client.js/lib/program";
import { findAssociatedTokenAddress, TokenPair } from "@twamm/client.js";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { isNil } from "ramda";

import useProgram from "./use-program";
import useTxRunnerContext from "./use-transaction-runner-context";

export default () => {
  const { provider, program } = useProgram();
  const { commit } = useTxRunnerContext();

  const pairClient = new TokenPair(program);

  const findProgramAddress = findAddress(program);

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

    const aCustody = await findAssociatedTokenAddress(transferAuthority, aMint);

    const bCustody = await findAssociatedTokenAddress(transferAuthority, bMint);

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
        provider.wallet.publicKey
      ),
      await createCloseNativeTokenAccountInstruction(
        bMint,
        bWallet,
        provider.wallet.publicKey
      ),
    ];

    const post = postInstructions.filter(
      (i): i is TransactionInstruction => !isNil(i)
    );

    const result = await program.methods
      .cancelOrder({
        lpAmount: new BN(lpAmount),
      })
      .accounts({
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
      })
      .preInstructions(pre)
      .postInstructions(post)
      .rpc()
      .catch((e: Error) => {
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
    async executeMany(
      params: Array<{
        amount: number;
        orderAddress: PublicKey;
        poolAddress: PublicKey;
      }>
    ) {
      const poolIds = params.map((data) => data.poolAddress);

      const tokenPairs = await Promise.all(
        poolIds.map((poolId) => {
          const d: unknown = pairClient.getPairByPoolAddress(poolId);

          return d as TokenPairProgramData;
        })
      );

      const cancelParams = params.map((data, i) => ({
        ...data,
        a: tokenPairs[i].configA.mint,
        b: tokenPairs[i].configB.mint,
      }));

      const results: Array<string | undefined> = await Promise.all(
        cancelParams.map((data) => commit(run(data)))
      );

      return results;
    },
  };
};
