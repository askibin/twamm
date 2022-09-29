import type { Address, Idl } from "@project-serum/anchor";

import idlJson from "./idl.json";

export const programId: Address | undefined =
  process.env.NEXT_PUBLIC_PROGRAM_ADDRESS;

export const idl = idlJson as Idl;
