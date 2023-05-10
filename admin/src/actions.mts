import * as web3 from "@solana/web3.js";
import { Command } from "./commands.mts";
import Client from "./client.mts";

export const init = async (
  client: ReturnType<typeof Client>,
  command: Command<{ minSignatures: number }, web3.PublicKey[]>
) => {
  console.log(client, command);
};
