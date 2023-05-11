import * as a from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import Idl from "@program_types/twamm.ts";
import readSigner from "./utils/read-signer-keypair.mts";

const COMMITMENT: web3.Commitment = "confirmed";

type TwammProgram = a.Program<Idl.Twamm>;

const encode = (label: string) => a.utils.bytes.utf8.encode(label);

export type ClusterMoniker = web3.Cluster & string;

export default function client(
  urlOrMoniker: ClusterMoniker,
  programId: string
) {
  const url = urlOrMoniker.startsWith("http")
    ? urlOrMoniker
    : web3.clusterApiUrl(urlOrMoniker);

  // const pid = new web3.PublicKey(programId);

  const provider = a.AnchorProvider.local(url, {
    commitment: COMMITMENT,
    preflightCommitment: COMMITMENT,
  });

  const program = a.workspace.Twamm as TwammProgram;

  console.log("666", program.programId)

  return { /*pid,*/ provider, program };
}

export const upgradeAuthority = new web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");

export const multisig = async (program: TwammProgram, name = "multisig") => {
  const [pda, bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(encode(name))],
    program.programId
  );

  return { pda, bump };
};

export const oracleTokenA = async (
  program: TwammProgram,
  tokenA: web3.PublicKey,
  tokenB: web3.PublicKey,
  name = "token_a_oracle"
) => {
  const [pda, bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(encode(name)), tokenA.toBuffer(), tokenB.toBuffer()],
    program.programId
  );

  return { pda, bump };
};

export const oracleTokenB = async (
  program: TwammProgram,
  tokenA: web3.PublicKey,
  tokenB: web3.PublicKey,
  name = "token_b_oracle"
) => {
  const [pda, bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(encode(name)), tokenA.toBuffer(), tokenB.toBuffer()],
    program.programId
  );

  return { pda, bump };
};

export const tokenPair = async (
  program: TwammProgram,
  tokenA: web3.PublicKey,
  tokenB: web3.PublicKey,
  name = "token_pair"
) => {
  const [pda, bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(encode(name)), tokenA.toBuffer(), tokenB.toBuffer()],
    program.programId
  );

  return { pda, bump };
};

export const transferAuthority = async (
  program: TwammProgram,
  name = "transfer_authority"
) => {
  const [pda, bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(encode(name))],
    program.programId
  );

  return { pda, bump };
};

export const twamm = async (program: TwammProgram, name = "twamm") => {
  const [pda, bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(encode(name))],
    program.programId
  );

  return { pda, bump };
};

export const twammProgramData = async (program: TwammProgram) => {
  const [pda, bump] = web3.PublicKey.findProgramAddressSync(
    [program.programId.toBuffer()],
    upgradeAuthority,// web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
  );

  return { pda, bump };
};
