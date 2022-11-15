import type { Provider, Program } from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { NATIVE_MINT } from "@solana/spl-token";
import { findAddress } from "@twamm/client.js/lib/program";
import { findAssociatedTokenAddress, TokenPair } from "@twamm/client.js";
import { Order } from "@twamm/client.js/lib/order";
import { Pool } from "@twamm/client.js/lib/pool";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import useProgram from "./use-program";
import useTxRunnerContext from "./use-transaction-runner-context";
import { NativeToken } from "../utils/twamm-client";

const SOL = NATIVE_MINT.toBase58();

const getOrderKey = (
  provider: Provider,
  program: Program,
  aCustody: PublicKey,
  bCustody: PublicKey
) => {
  const findProgramAddress = findAddress(program);
  const pool = new Pool(program);

  return async (tif: number, poolCounter: BN) => {
    const poolKey = await pool.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      poolCounter
    );

    return findProgramAddress("order", [
      // @ts-ignore
      provider.wallet.publicKey.toBuffer(),
      poolKey.toBuffer(),
    ]);
  };
};

export default () => {
  const { provider, program } = useProgram();
  const { commit } = useTxRunnerContext();

  const orderClient = new Order(program, provider);
  const poolClient = new Pool(program);
  const pairClient = new TokenPair(program);

  const findProgramAddress = findAddress(program);

  const run = async function execute({
    a: aMint,
    b: bMint,
    amount: lpAmount,
    poolAddress,
  }: {
    a: PublicKey;
    b: PublicKey;
    amount: number;
    poolAddress: PublicKey;
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

    console.log({ aMintPublicKey, bMintPublicKey })

    // FIXME: move nativetoken to cli
    const closeANativeInstruction = NativeToken.closeAccountInstruction(
      aMintPublicKey,
      aWallet,
      provider.wallet.publicKey
    );

    const closeBNativeInstruction = NativeToken.closeAccountInstruction(
      bMintPublicKey,
      bWallet,
      provider.wallet.publicKey
    );

    const postInstructions: TransactionInstruction[] = [];
    if (closeANativeInstruction) postInstructions.push(closeANativeInstruction);
    if (closeBNativeInstruction) postInstructions.push(closeBNativeInstruction);

    //const getOrder = getOrderKey(provider, program, aCustody, bCustody);

    console.log({ postInstructions });

    const pool = (await poolClient.getPool(poolAddress)) as PoolData;

    const order = await orderClient.getKeyByCustodies(
      aCustody,
      bCustody,
      pool.timeInForce,
      pool.counter
    );

    console.info(
      pool.timeInForce,
      Number(pool.counter),
      String(order),
      String(poolAddress)
    );

    console.log(String(aWallet), String(bWallet));

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
        order,
        pool: poolAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .postInstructions(postInstructions)
      .rpc()
      .catch(console.error);

    return result;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      const result = await commit(run(params));

      return result;
    },
    async executeMany(
      params: Array<{ amount: number; poolAddress: PublicKey }>
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
