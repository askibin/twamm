import type { BN, Program, Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { WalletProvider } from "@twamm/types/lib";

import { findAddress } from "./program";
import { findAssociatedTokenAddress } from "./find-associated-token-address";
import { Order } from "./order";
import { Pool } from "./pool";

export class Transfer {
  program: Program;

  provider: Provider;

  constructor(program: Program, provider: Provider) {
    this.program = program;
    this.provider = provider;
  }

  async findTransferAccounts(
    primary: PublicKey,
    secondary: PublicKey,
    tif: number,
    currentCounter: BN,
    targetCounter: BN
  ) {
    const { wallet } = this.provider as WalletProvider;

    if (!wallet) throw new Error("Absent wallet");

    const findProgramAddress = findAddress(this.program);
    const order = new Order(this.program, this.provider);
    const pool = new Pool(this.program);

    const transferAuthority = await findProgramAddress(
      "transfer_authority",
      []
    );

    const tokenPair = await findProgramAddress("token_pair", [
      primary.toBuffer(),
      secondary.toBuffer(),
    ]);

    const aCustody = await findAssociatedTokenAddress(
      transferAuthority,
      primary
    );
    const aWallet = await findAssociatedTokenAddress(wallet.publicKey, primary);

    const bCustody = await findAssociatedTokenAddress(
      transferAuthority,
      secondary
    );
    const bWallet = await findAssociatedTokenAddress(
      wallet.publicKey,
      secondary
    );

    const currentPool = await pool.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      currentCounter
    );

    const targetOrder = await order.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      targetCounter
    );
    const targetPool = await pool.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      targetCounter
    );

    return {
      aWallet,
      aCustody,
      bWallet,
      bCustody,
      currentPool,
      targetOrder,
      targetPool,
      tokenPair,
    };
  }
}
