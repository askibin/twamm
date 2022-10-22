import type { Provider, Program } from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { findAddress } from "@twamm/client.js/lib/program";

import { useProgram } from "./use-program";
import { useTxRunnerContext } from "./use-transaction-runner-context";
import {
  findAssociatedTokenAddress,
  NativeToken,
  poolClient,
} from "../utils/twamm-client";

const getPoolKey = (
  program: Program,
  aCustody: PublicKey,
  bCustody: PublicKey
) => {
  const findProgramAddress = findAddress(program);

  return async (tif: number, poolCounter: BN) => {
    const tifBuf = Buffer.alloc(4);
    tifBuf.writeUInt32LE(tif, 0);

    const counterBuf = Buffer.alloc(8);
    counterBuf.writeBigUInt64LE(BigInt(poolCounter.toString()), 0);

    return findProgramAddress("pool", [
      aCustody.toBuffer(),
      bCustody.toBuffer(),
      tifBuf,
      counterBuf,
    ]);
  };
};

const getOrderKey = (
  provider: Provider,
  program: Program,
  aCustody: PublicKey,
  bCustody: PublicKey
) => {
  const findProgramAddress = findAddress(program);

  return async (tif: number, poolCounter: BN) => {
    const poolKey = await getPoolKey(
      program,
      aCustody,
      bCustody
    )(tif, poolCounter);

    return findProgramAddress("order", [
      // @ts-ignore
      provider.wallet.publicKey.toBuffer(),
      poolKey.toBuffer(),
    ]);
  };
};

export const useCancelOrder = () => {
  const { provider, program } = useProgram();
  const { commit } = useTxRunnerContext();

  const poolCli = poolClient(program.account);

  const findProgramAddress = findAddress(program);

  const run = async function execute({
    aMint,
    bMint,
    lpAmount,
    poolAddress,
  }: {
    aMint: PublicKey;
    bMint: PublicKey;
    lpAmount: number;
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

    const getOrder = getOrderKey(provider, program, aCustody, bCustody);

    const pool = await poolCli.getPool(poolAddress);

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
        order: await getOrder(pool.timeInForce, pool.counter),
        pool: poolAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .postInstructions(postInstructions)
      .rpc();

    return result;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      const result = await commit(run(params));

      return result;
    },
  };
};
