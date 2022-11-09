import type { Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { TOKEN_PROGRAM_ID, NATIVE_MINT } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import useProgram from "./use-program";

type Params = { address: PublicKey; mint: string };

type BalanceData = {
  account: {
    executable: boolean;
    lamports: number;
    rentEpoch?: number;
    owner: PublicKey;
    data: {
      program: "spl-token";
      space: number;
      parsed: {
        type: "account";
        info: {
          isNative: boolean;
          mint: string;
          owner: string;
          state: string;
          tokenAmount: {
            amount: string;
            decimals: number;
            uiAmount: number;
            uiAmountString: string;
          };
        };
      };
    };
  };
  pubkey: PublicKey;
};

const isNative = (a: string) => a === NATIVE_MINT.toBase58();

const swrKey = (params: Params) => ({
  key: "balance",
  params,
});

const fetcher =
  ({ provider }: { provider: Provider }) =>
  async ({ params }: { params: Params }) => {
    if (isNative(params.mint)) {
      const data: number = await provider.connection.getBalance(params.address);
      return data * 1e-9;
    }

    const data = (await provider.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          { dataSize: 165 },
          {
            memcmp: {
              offset: 32,
              bytes: params.address.toBase58(),
            },
          },
        ],
      }
    )) as BalanceData[];

    const accounts = data.map((d) => d.account.data.parsed.info);
    const targetInfo = accounts.find((a) => a.mint === params.mint);

    if (!targetInfo) return 0;

    return targetInfo.tokenAmount.uiAmount;
  };

export default (mint: Voidable<string>, options = {}) => {
  const { publicKey: address } = useWallet();
  const { provider } = useProgram();

  return useSWR(
    address && mint && swrKey({ address, mint }),
    fetcher({ provider }),
    options
  );
};
