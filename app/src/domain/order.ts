import type { Provider, Program } from "@project-serum/anchor";
import M from "easy-maybe/lib";
import { BN } from "@project-serum/anchor";
import { findAddress } from "@twamm/client.js/lib/program";
import { findAssociatedTokenAddress } from "@twamm/client.js";
import { PublicKey } from "@solana/web3.js";
import { OrderSide } from "@twamm/types/lib";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import type { IndexedTIF, SelectedTIF } from "./interval.d";
import { SpecialIntervals } from "./interval.d";

export type ValidationErrors = {
  a?: Error;
  b?: Error;
  amount?: Error;
  tif?: Error;
};

export const validate = (
  amount: number,
  tif: SelectedTIF | undefined,
  tokenA: string | undefined,
  tokenB: string | undefined
) => {
  const result: ValidationErrors = {};

  if (!tokenA) result.a = new Error("Should select the token");
  if (!tokenB) result.b = new Error("Should select the token");
  if (!amount) result.amount = new Error("Specify the amount of token");
  if (Number.isNaN(Number(amount)))
    result.amount = new Error("Amount should be the number");

  if (tif) {
    const [timeInForce, modes] = tif;

    if (!timeInForce && modes !== SpecialIntervals.INSTANT) {
      result.tif = new Error("Should choose the interval");
    }
  } else if (!tif) {
    result.tif = new Error("Should choose the interval");
  }

  return Object.keys(result).length ? result : undefined;
};

export const prepare4Program = (
  timeInForce: TIF | undefined,
  nextPool: number | undefined,
  tifIntervals: IndexedTIF[] | undefined,
  side: OrderSide,
  amount: number,
  decimals: number,
  aMint: string,
  bMint: string,
  tifs: number[],
  poolCounters: any[]
) => {
  if (!timeInForce) throw new Error("Absent tif");

  const usingCurrentPool = nextPool === -1;
  const usingNextPool = Boolean(nextPool && nextPool > 0);

  const finalTif = M.withDefault(
    undefined,
    M.andMap((intervals) => {
      const interval = intervals.find((itif: IndexedTIF) => {
        // if (nextPool !== -1) return itif.tif === timeInForce;
        if (!usingCurrentPool) return itif.tif === timeInForce;
        return itif.left === timeInForce;
      });

      return interval;
    }, M.of(tifIntervals))
  );

  if (!finalTif) throw new Error("Wrong tif");
  if (finalTif.left === 0)
    throw new Error("Can not place order to the closed pool");

  const params = {
    side,
    amount,
    decimals,
    aMint,
    bMint,
    nextPool: usingNextPool, // nextPool && nextPool > 0,
    tifs,
    poolCounters,
    tif: finalTif.tif,
  };

  return params;
};

export const prepare4Jupiter = (
  side: OrderSide,
  amount: number,
  decimals: number,
  aMint: string,
  bMint: string
) => {
  const params = {
    side,
    amount,
    decimals,
    aMint,
    bMint,
  };

  return params;
};

export const cancelOrder = async (
  provider: Provider,
  program: Program,
  aMint: PublicKey,
  bMint: PublicKey,
  lpAmount: number,
  orderAddress: PublicKey,
  poolAddress: PublicKey
) => {
  const findProgramAddress = findAddress(program);

  const TOKEN_PROGRAM_ID = SplToken.getProgramId();

  const transferAuthority = await findProgramAddress("transfer_authority", []);

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

  console.log({ program });

  const tx = program.instruction.cancelOrder(
    {
      lpAmount: new BN(lpAmount),
    },
    { accounts }
  );

  return tx;
};
