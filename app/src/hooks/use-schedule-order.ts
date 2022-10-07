import { BN } from "@project-serum/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createSyncNativeInstruction,
  createAssociatedTokenAccountInstruction,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { findAddress } from "@twamm/client.js/lib/program";

import { forit } from "../utils/forit";
import { useProgram } from "./use-program";

const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

const assureAccountIsCreated =
  (provider: any) => async (mint: PublicKey, accountAddress: PublicKey) => {
    try {
      console.log(3, accountAddress)

      throw new Error('TokenAccountNotFoundError')
      // let tokenAccount = await Token.getAccountInfo(provider.connection, accountAddress);
    } catch (err) {
      if (!err.stack || !err.stack.startsWith("TokenAccountNotFoundError")) {
        throw new Error("Unexpected error in getAccount");
      }
      let transaction = new Transaction();
      transaction.add(
        createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey,
          accountAddress,
          provider.wallet.publicKey,
          mint
        )
      );

      await provider.sendAll([{ tx: transaction }]);
    }
  };

const getPoolKey =
  (findProgramAddress, aCustody, bCustody) =>
  async (tif: number, poolCounter: BN) => {
    let tifBuf = Buffer.alloc(4);
    tifBuf.writeUInt32LE(tif, 0);

    let counterBuf = Buffer.alloc(8);
    counterBuf.writeBigUInt64LE(BigInt(poolCounter.toString()), 0);

    return findProgramAddress("pool", [
      aCustody.toBuffer(),
      bCustody.toBuffer(),
      tifBuf,
      counterBuf,
    ]);
  };

const getOrderKey =
  (provider, findProgramAddress, aCustody, bCustody) =>
  async (tif: number, poolCounter: BN) => {
    const poolKey = await getPoolKey(
      findProgramAddress,
      aCustody,
      bCustody
    )(tif, poolCounter);

    return findProgramAddress("order", [
      provider.wallet.publicKey.toBuffer(),
      poolKey.toBuffer(),
    ]);
  };

export const useScheduleOrder = () => {
  const { program, provider } = useProgram();

  const findProgramAddress = findAddress(program);

  async function execute({
    amount,
    side,
    aMint,
    bMint,
    tif,
    nextPool,
    tifs,
    poolCounters,
  }: {
    amount: number;
    side: "sell" | "buy";
    aMint: string;
    bMint: string;
    tif: number;
    nextPool?: number;
  }) {
    console.log(amount, tif, aMint, bMint, nextPool);

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

    const aCustody = await Token.getAssociatedTokenAddress(
      aMintPublicKey,
      transferAuthority,
      aMintPublicKey,
      provider.wallet.publicKey,
      true
    );

    const bCustody = await Token.getAssociatedTokenAddress(
      bMintPublicKey,
      transferAuthority,
      bMintPublicKey,
      provider.wallet.publicKey,
      true
    );

    const aWallet = await Token.getAssociatedTokenAddress(
      aMintPublicKey,
      provider.wallet.publicKey,
      aMintPublicKey,
      provider.wallet.publicKey
    );

    const bWallet = await Token.getAssociatedTokenAddress(
      bMintPublicKey,
      provider.wallet.publicKey,
      bMintPublicKey,
      provider.wallet.publicKey
    );

    await assureAccountIsCreated(provider)(aMintPublicKey, aWallet);

    await assureAccountIsCreated(provider)(bMintPublicKey, bWallet);

    const pre = [];
    if (side === "sell" && aMint === SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: aWallet,
          lamports: amount,
        })
      );
      // pre.push(createSyncNativeInstruction(aWallet));
    }

    if (side === "buy" && bMint == SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: bWallet,
          lamports: amount,
        })
      );

      // pre.push(createSyncNativeInstruction(bWallet));
    }

    const index = tifs.indexOf(tif);
    if (index < 0) throw new Error("Invalid TIF");
    const counter = poolCounters[index];

    const getOrder = getOrderKey(
      provider,
      findProgramAddress,
      aCustody,
      bCustody
    );
    const getPool = getPoolKey(findProgramAddress, aCustody, bCustody);

    const result = await forit(
      program.methods
        .placeOrder({
          side: side === "sell" ? { sell: {} } : { buy: {} },
          timeInForce: tif,
          amount: new BN(amount),
        })
        .accounts({
          owner: provider.wallet.publicKey,
          userAccountTokenA: aWallet,
          userAccountTokenB: bWallet,
          tokenPair: tokenPairAddress,
          custodyTokenA: aCustody,
          custodyTokenB: bCustody,
          order: await getOrder(tif, counter), // nextPool ? counter + 1 : counter ),
          currentPool: await getPool(tif, counter),
          targetPool: await getPool(tif, counter), // nextPool ?...),
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        // .preInstructions(pre)
        .rpc()
    );

    console.log("res", result);

    return result;
  }

  return { execute };
};
