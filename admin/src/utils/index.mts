import * as web3 from "@solana/web3.js";

export const populateSigners = (signers: string[]) =>
  signers.map((signer) => new web3.PublicKey(signer));

export const prettifyJSON = (a: {}) => JSON.stringify(a, null, 2);
