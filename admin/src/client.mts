import * as a from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import Idl from "@program_types/twamm.ts";

const COMMITMENT: web3.Commitment = "confirmed";

export type ClusterMoniker = web3.Cluster & string;

export default function client(
  urlOrMoniker: ClusterMoniker,
  programId: string
) {
  const url = urlOrMoniker.startsWith("http")
    ? urlOrMoniker
    : web3.clusterApiUrl(urlOrMoniker);

  const pid = new web3.PublicKey(programId);

  const provider = a.AnchorProvider.local(url, {
    commitment: COMMITMENT,
    preflightCommitment: COMMITMENT,
  });

  const program = a.workspace.Twamm as a.Program<Idl.Twamm>;

  return { pid, provider, program };
}
