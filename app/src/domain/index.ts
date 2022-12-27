import { OrderSide } from "@twamm/types/lib";

export const populatePairByType = <T = any>(a: T, b: T, type: OrderSide): T[] =>
  type === OrderSide.sell ? [a, b] : [b, a];

export const formatPrice = (a: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(a);
