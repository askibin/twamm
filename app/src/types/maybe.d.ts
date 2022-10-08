declare enum MaybeType {
  Just = "maybe-just",
  Nothing = "maybe-nothing",
}

interface Just<T> {
  type: typeof MaybeType.Just;
  value: T;
}

interface Nothing {
  type: typeof MaybeType.Nothing;
}

declare type Maybe<T> = Just<T> | Nothing;

const Nothing = (): Nothing => ({
  type: MaybeType.Nothing,
});

const Just = <T>(value: T): Just<T> => ({
  type: MaybeType.Just,
  value,
});
