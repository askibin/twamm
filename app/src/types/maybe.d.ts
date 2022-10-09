export enum MaybeType {
  Just = "maybe-just",
  Nothing = "maybe-nothing",
}

declare interface Just<T> {
  type: typeof MaybeType.Just;
  value: T;
}

declare interface Nothing {
  type: typeof MaybeType.Nothing;
}

declare type Maybe<T> = Just<T> | Nothing;
