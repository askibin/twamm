export const populatePairByType = <T = any>(a: T, b: T, type: OrderType): T[] =>
  type === "sell" ? [a, b] : [b, a];

export const formatPrice = (a: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(a);
