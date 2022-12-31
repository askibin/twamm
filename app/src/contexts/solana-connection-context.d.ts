import type { Commitment } from "@solana/web3.js";

export type CommitmentLevel = Extract<Commitment, "confirmed">;
