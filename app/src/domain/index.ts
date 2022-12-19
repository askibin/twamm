import { OrderSides } from "../types/enums.d";

export const populatePairByType = <T = any>(a: T, b: T, type: OrderType): T[] =>
  type === OrderSides.sell ? [a, b] : [b, a];

export const formatPrice = (a: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(a);
