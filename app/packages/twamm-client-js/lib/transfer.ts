import type { BN, Program, Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { WalletProvider } from "@twamm/types/lib";

import { findAddress } from "./program";
import { getAssocTokenAddress } from "./address";
import { Order } from "./order";
import { Pool, PoolAuthority } from "./pool";

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
    tif?: number,
    currentCounter?: BN,
    targetCounter?: BN
  ) {
    const { wallet } = this.provider as WalletProvider;

    if (!wallet) throw new Error("Absent wallet");

    const findProgramAddress = findAddress(this.program);
    const order = new Order(this.program, this.provider);
    const pool = new Pool(this.program);
    const poolAuthority = new PoolAuthority(this.program, primary, secondary);

    await poolAuthority.init();
    // init authority

    const transferAuthority1 = await findProgramAddress(
      "transfer_authority",
      []
    );

    const transferAuthority = poolAuthority.transferAuthority as PublicKey;

    const tokenPair = await findProgramAddress("token_pair", [
      primary.toBuffer(),
      secondary.toBuffer(),
    ]);

    const aCustody = await getAssocTokenAddress(primary, transferAuthority);
    const aWallet = await getAssocTokenAddress(primary, wallet.publicKey);

    const bCustody = await getAssocTokenAddress(secondary, transferAuthority);
    const bWallet = await getAssocTokenAddress(secondary, wallet.publicKey);

    if (tif !== undefined && currentCounter && targetCounter) {
      const currentPool = await poolAuthority.getKey(
        //aCustody,
        //bCustody,
        tif,
        currentCounter
      );
      const targetPool = await poolAuthority.getKey(
        //aCustody,
        //bCustody,
        tif,
        targetCounter
      );

      const targetOrder = await order.getAddressByPool(targetPool);

      return {
        aWallet,
        aCustody,
        bWallet,
        bCustody,
        currentPool,
        targetOrder,
        targetPool,
        tokenPair,
        transferAuthority,
      };
    }

    return {
      aWallet,
      aCustody,
      bWallet,
      bCustody,
      tokenPair,
      transferAuthority,
    };
  }
}
