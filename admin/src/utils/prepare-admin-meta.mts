import * as web3 from "@solana/web3.js";

export type AdminMeta = {
  isSigner: boolean;
  isWritable: boolean;
  pubkey: web3.PublicKey;
};

export default (keypair: web3.Keypair): AdminMeta => ({
  isSigner: false,
  isWritable: false,
  pubkey: keypair.publicKey,
});

export const fromPublicKey = (pubkey: web3.PublicKey): AdminMeta => ({
  isSigner: false,
  isWritable: false,
  pubkey,
});
