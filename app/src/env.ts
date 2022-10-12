import type { Address, Idl } from "@project-serum/anchor";

import idlJson from "./idl.json";

export const muiLicenseKey = process.env.NEXT_PUBLIC_LICENSE_KEY_MUI ?? "";

export const programId: Address | undefined =
  process.env.NEXT_PUBLIC_PROGRAM_ADDRESS;

export const idl = idlJson as Idl;

export const ClusterApiUrl = process.env.NEXT_PUBLIC_CLUSTER_API_URL;
