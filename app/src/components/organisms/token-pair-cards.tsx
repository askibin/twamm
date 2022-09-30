import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import PairCard, { Blank } from "../atoms/pair-card";
import * as Styled from "./token-pair-cards.styled";

export interface Props {
  data?: Array<any>;
}

type PairData = {
  configA: {
    mint: PublicKey;
  };
  configB: {
    mint: PublicKey;
  };
  // TODO: improve fee types
  feeNumerator: any;
  feeDenominator: any;
};

export default ({ data }: Props) => {
  if (!data) {
    return (
      <Styled.BlankCardList>
        {new Array(3).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`blank-${i}`}>
            <Blank />
          </li>
        ))}
      </Styled.BlankCardList>
    );
  }

  const tokenPairs = useMemo(() => {
    const pairs: Array<{
      aMint: string;
      bMint: string;
      id: string;
      fee: number;
    }> = [];

    data.forEach((pair: PairData, i: number) => {
      const { configA, configB, feeNumerator, feeDenominator } = pair;

      const aMint = configA.mint.toBase58();
      const bMint = configB.mint.toBase58();
      const numerator = feeNumerator.toNumber();
      const denominator = feeDenominator.toNumber();

      const fee = numerator / denominator;

      pairs[i] = {
        aMint,
        bMint,
        fee,
        id: `${aMint}-${bMint}`,
      };
    });

    return pairs;
  }, [data]);

  return (
    <Styled.CardList>
      {tokenPairs.map((tokenPair) => (
        <Styled.CardListItem key={tokenPair.id}>
          <PairCard
            aMint={tokenPair.aMint}
            bMint={tokenPair.bMint}
            perf={0}
            fee={tokenPair.fee}
          />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
