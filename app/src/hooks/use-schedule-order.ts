import type { Provider, Program } from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createSyncNativeInstruction,
} from "@solana/spl-token";
import { findAssociatedTokenAddress } from "@twamm/client.js";
import { findAddress } from "@twamm/client.js/lib/program";

import useProgram from "./use-program";
import useTxRunnerContext from "./use-transaction-runner-context";

const SOL_ADDRESS = NATIVE_MINT.toBase58();

// TODO: improve types as one for this helper is not exported
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

// TODO: improve to return instructions;
const assureAccountIsCreated =
  (provider: any) => async (mint: PublicKey, accountAddress: PublicKey) => {
    try {
      const accountInfo = await provider.connection.getAccountInfo(
        accountAddress
      );

      if (!accountInfo) {
        throw new Error("TokenAccountNotFoundError");
      }
    } catch (err: any) {
      if (!err?.message.startsWith("TokenAccountNotFoundError")) {
        throw new Error("Unexpected error in getAccountInfo");
      }

      return createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        accountAddress,
        provider.wallet.publicKey,
        mint
      );
    }

    return undefined;
  };

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

export default () => {
  const { program, provider } = useProgram();
  const { commit } = useTxRunnerContext();

  const findProgramAddress = findAddress(program);

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

    const pre = [];

    const i1 = await assureAccountIsCreated(provider)(aMintPublicKey, aWallet);

    if (i1) pre.push(i1);

    const i2 = await assureAccountIsCreated(provider)(bMintPublicKey, bWallet);

    if (i2) pre.push(i2);

    if (side === "sell" && aMint === SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: aWallet,
          lamports: amount * 1e9,
        })
      );
      pre.push(createSyncNativeInstruction(aWallet, TOKEN_PROGRAM_ID));
    }

    if (side === "buy" && bMint === SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: bWallet,
          lamports: amount * 1e9,
        })
      );

      pre.push(createSyncNativeInstruction(bWallet, TOKEN_PROGRAM_ID));
    }

    const index = tifs.indexOf(tif);
    if (index < 0) throw new Error("Invalid TIF");
    const counter = poolCounters[index];

    console.log(tif, tifs, { index }, counter.toNumber(), poolCounters);

    console.log(poolCounters.map((a) => a.toNumber()));

    const getOrder = getOrderKey(provider, program, aCustody, bCustody);
    const getPool = getPoolKey(program, aCustody, bCustody);

    const orderParams = {
      side: side === "sell" ? { sell: {} } : { buy: {} },
      timeInForce: tif,
      amount: new BN(amount * 10 ** decimals),
    };

    const order = await getOrder(
      tif,
      nextPool ? counter.toNumber() + 1 : counter
    );
    const currentPool = await getPool(tif, counter);
    const targetPool = await getPool(
      tif,
      nextPool ? Number(counter) + 1 : counter
    );

    console.log("oct", order, currentPool, targetPool);

    const result = await program.methods
      .placeOrder(orderParams)
      .accounts({
        owner: provider.wallet.publicKey,
        userAccountTokenA: aWallet,
        userAccountTokenB: bWallet,
        tokenPair: tokenPairAddress,
        custodyTokenA: aCustody,
        custodyTokenB: bCustody,
        order,
        currentPool,
        targetPool,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(pre)
      .rpc();

    console.log(result);

    return result;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      const result = await commit(run(params));

      return result;
    },
  };
};
