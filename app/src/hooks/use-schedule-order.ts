import { BN } from "@project-serum/anchor";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { findAddress } from "@twamm/client.js/lib/program";

import * as Token from "@solana/spl-token";

import { forit } from "../utils/forit";
import { useProgram } from "./use-program";

const SOL_ADDRESS = NATIVE_MINT.toBase58();

const createAssociatedTokenAccountInstruction = (
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
};

const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  mintAddress: PublicKey
) => {
  const [address] = await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return address;
};

const assureAccountIsCreated =
  (provider: any) => async (mint: PublicKey, accountAddress: PublicKey) => {
    try {
      const accountInfo = await provider.connection.getAccountInfo(
        accountAddress
      );

      if (!accountInfo) {
        throw new Error("TokenAccountNotFoundError");
      }

      console.log("accInfo", accountInfo);
    } catch (err: any) {
      console.log({ err });
      if (!err?.message.startsWith("TokenAccountNotFoundError")) {
        throw new Error("Unexpected error in getAccountInfo");
      }

      const transaction = new Transaction();

      const accounts = [
        provider.wallet.publicKey,
        accountAddress,
        provider.wallet.publicKey,
        mint,
      ];
      console.log("acc", accounts);

      transaction.add(
        createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey,
          accountAddress,
          provider.wallet.publicKey,
          mint
        )
      );

      console.log({ transaction });

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

    await assureAccountIsCreated(provider)(aMintPublicKey, aWallet);

    await assureAccountIsCreated(provider)(bMintPublicKey, bWallet);

    const pre = [];
    if (side === "sell" && aMint === SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: aWallet,
          lamports: amount * 1e6,
        })
      );
      pre.push(Token.createSyncNativeInstruction(aWallet));
    }

    if (side === "buy" && bMint == SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: bWallet,
          lamports: amount * 1e6,
        })
      );

      pre.push(Token.createSyncNativeInstruction(bWallet));
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

    console.log(6666, BN, amount);

    let result;
    try {
      result = await forit(
        program.methods
          .placeOrder({
            side: side === "sell" ? { sell: {} } : { buy: {} },
            timeInForce: tif,
            amount: new BN(Number(amount)),
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
          .catch((err) => {
            console.warn(err);
          })
      );
    } catch (erorr) {
      console.log("eror", erorr);
    }

    console.log("executing");

    console.log("res", result);

    return result;
  }

  return { execute };
};
