export enum MaybeType {
  Just = "maybe-just",
  Nothing = "maybe-nothing",
}

declare interface Just<T> {
  type: typeof MaybeType.Just;
  value: Exclude<T, undefined | null>;
}

declare interface Nothing {
  type: typeof MaybeType.Nothing;
}

declare type Maybe<T> = Just<T> | Nothing;
