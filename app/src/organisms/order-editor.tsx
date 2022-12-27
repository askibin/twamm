import M, { Extra } from "easy-maybe/lib";
import { OrderSide } from "@twamm/types/lib";
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import * as Styled from "./order-editor.styled";
import CoinSelect from "./coin-select";
import Loading from "../atoms/loading";
import PriceInfo from "./price-info";
import OrderForm from "./order-form";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import usePrice from "../hooks/use-price";
import useTokenPairByTokens from "../hooks/use-token-pair-by-tokens";
import { refreshEach } from "../swr-options";

export default ({
  a,
  all,
  available,
  b,
  cancellable,
  onSelectA,
  onSelectB,
  onSwap,
  onTradeChange,
  tokenPairs,
  tokenPair,
  tradeSide,
}: {
  a: Voidable<TokenInfo>;
  all: Voidable<TokenInfo["address"][]>;
  available: Voidable<TokenInfo["address"][]>;
  b: Voidable<TokenInfo>;
  cancellable: undefined;
  onSelectA: (token: TokenInfo) => void;
  onSelectB: (token: TokenInfo) => void;
  onSwap: (price?: number) => void;
  onTradeChange: (arg0: {
    amount: number;
    pair: AddressPair;
    type: OrderSide;
  }) => void;
  tokenPairs: Voidable<AddressPair[]>;
  tokenPair: Voidable<JupToken[]>;
  tradeSide: Voidable<OrderSide>;
}) => {
  const pairs = M.of(tokenPairs);
  const pair = M.of(tokenPair);

  const [curToken, setCurToken] = useState<number>();
  const selectCoinRef = useRef<Ref>();

  const tokenPairPrice = usePrice(
    M.withDefault(
      undefined,
      M.andMap(
        ([lead, slave]) => ({ id: lead.address, vsToken: slave.address }),
        Extra.combine2([M.of(a), M.of(b)])
      )
    )
  );

  const selectedPair = useTokenPairByTokens(
    a && b && { aToken: a, bToken: b },
    refreshEach()
  );

  useEffect(() => {
    const onUnmount = () => {
      if (selectedPair.data) {
        const { exchangePair } = selectedPair.data;

        const [p, t]: ExchangePair = exchangePair;

        onTradeChange({
          amount: 0,
          pair: p.map((_a: JupToken) => _a.address),
          type: t,
        });
      }
    };

    return onUnmount;
  }, [onTradeChange, pair, pairs, selectedPair.data, tradeSide]);

  const onTokenChoose = useCallback(
    (index: number) => {
      setCurToken(index);
      if (selectCoinRef.current && !selectCoinRef.current?.isOpened)
        selectCoinRef.current.open();
    },
    [setCurToken]
  );

  const onTokenAChoose = useCallback(() => {
    onTokenChoose(1);
  }, [onTokenChoose]);

  const onTokenBChoose = useCallback(() => {
    onTokenChoose(2);
  }, [onTokenChoose]);

  const onTokenSwap = useCallback(() => {
    onSwap(tokenPairPrice.data);
  }, [tokenPairPrice.data, onSwap]);

  const onCoinDeselect = useCallback(() => {}, []);

  const onCoinSelect = useCallback(
    (token: TokenInfo) => {
      if (selectCoinRef.current?.isOpened) selectCoinRef.current.close();
      if (curToken === 1) onSelectA(token);
      if (curToken === 2) onSelectB(token);
    },
    [curToken, onSelectA, onSelectB]
  );

  if (
    Extra.isNothing(pair) ||
    Extra.isNothing(pairs) ||
    Extra.isNothing(M.of(available))
  )
    return <Loading />;

  return (
    <>
      <UniversalPopover ariaLabelledBy="select-coin-title" ref={selectCoinRef}>
        <CoinSelect
          id="select-coin-title"
          onDelete={onCoinDeselect}
          onSelect={onCoinSelect}
          selected={cancellable}
          tokens={curToken === 2 ? available : all}
        />
      </UniversalPopover>
      <Styled.Swap elevation={1}>
        <Box p={2}>
          <OrderForm
            lead={a}
            slave={b}
            onABSwap={onTokenSwap}
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            poolCounters={selectedPair.data?.poolCounters}
            poolsCurrent={selectedPair.data?.currentPoolPresent}
            poolTifs={selectedPair.data?.tifs}
            side={tradeSide}
            tokenA={a?.symbol}
            tokenADecimals={a?.decimals}
            tokenB={b?.symbol}
            tokenPair={selectedPair.data?.exchangePair[0]}
          />
        </Box>
      </Styled.Swap>
      <Box p={2}>
        <PriceInfo a={a} b={b} tokenPair={selectedPair.data} type={tradeSide} />
      </Box>
    </>
  );
};
