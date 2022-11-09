import Maybe, { Extra } from "easy-maybe/lib";
import type { PublicKey } from "@solana/web3.js";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import usePoolWithPair from "../../hooks/use-pool-with-pair";

export interface Params
  extends GridCellParams<
    void,
    {
      side: OrderTypeStruct;
      pool: PublicKey;
    }
  > {}

export default ({ row }: Pick<Params, "row">) => {
  const { pool: poolAddress, side } = row;

  const tokenPair = usePoolWithPair(poolAddress);

  const data = Extra.combine2([Maybe.of(tokenPair.data), Maybe.of(side)]);

  const quantity = Maybe.andMap<
    [{ pool: PoolData; pair: TokenPairProgramData }, OrderTypeStruct],
    string
  >(([{ pool, pair }, s]) => {
    const orderTypeData = s.sell ? pool.sellSide : pool.buySide;

    const decimals = s.sell ? pair.configA.decimals : pair.configB.decimals;

    return String(orderTypeData.lpSupply.toNumber() / 10 ** decimals);
  }, data);

  const quantityValue = Maybe.withDefault("-", quantity);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{quantityValue}</>;
};
