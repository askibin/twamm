import type { Provider, Program } from "@project-serum/anchor";
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
  createSyncNativeInstruction,
} from "@solana/spl-token";
import { findAddress } from "@twamm/client.js/lib/program";

import useProgram from "./use-program";
import useTxRunnerContext from "./use-transaction-runner-context";

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

      const transaction = new Transaction();

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

    const aMintPublicKey = new PublicKey(aMint); // side === "sell" ? aMint : bMint);
    const bMintPublicKey = new PublicKey(bMint); // side === "sell" ? bMint : aMint);

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
          lamports: amount * 1e9,
        })
      );
      pre.push(createSyncNativeInstruction(aWallet, NATIVE_MINT));
    }

    if (side === "buy" && bMint === SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: bWallet,
          lamports: amount * 1e9,
        })
      );

      pre.push(createSyncNativeInstruction(bWallet, NATIVE_MINT));
    }

    const index = tifs.indexOf(tif);
    if (index < 0) throw new Error("Invalid TIF");
    const counter = poolCounters[index];

    const getOrder = getOrderKey(provider, program, aCustody, bCustody);
    const getPool = getPoolKey(program, aCustody, bCustody);

    const result = await program.methods
      .placeOrder({
        side: side === "sell" ? { sell: {} } : { buy: {} },
        timeInForce: tif,
        amount: new BN(amount * 10 ** decimals),
      })
      .accounts({
        owner: provider.wallet.publicKey,
        userAccountTokenA: aWallet,
        userAccountTokenB: bWallet,
        tokenPair: tokenPairAddress,
        custodyTokenA: aCustody,
        custodyTokenB: bCustody,
        order: await getOrder(tif, nextPool ? Number(counter) + 1 : counter),
        currentPool: await getPool(tif, counter),
        targetPool: await getPool(
          tif,
          nextPool ? Number(counter) + 1 : counter
        ),
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(pre)
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
