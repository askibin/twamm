import * as web3 from "@solana/web3.js";

export default (keypair: web3.Keypair) => ({
  isSigner: false,
  isWritable: false,
  pubkey: keypair.publicKey,
});

export const fromPublicKey = (pubkey: web3.PublicKey) => ({
  isSigner: false,
  isWritable: false,
  pubkey,
});
