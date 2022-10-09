import { curry } from "ramda";

import type { Maybe, Just, Nothing } from "./maybe.d";
import { MaybeType } from "./maybe.d";

const NothingImpl = (): Nothing => ({
  type: MaybeType.Nothing,
});

const JustImpl = <T>(value: T): Just<T> => ({
  type: MaybeType.Just,
  value,
});

const andMap = <A, B>(f: (arg0: A) => B, m: Maybe<A>): Maybe<B> => {
  switch (m.type) {
    case MaybeType.Just:
      return JustImpl(f(m.value));
    case MaybeType.Nothing:
    default:
      return NothingImpl();
  }
};

const tap = <T>(f: (arg0: T) => void, m: Maybe<T>): Maybe<T> => {
  switch (m.type) {
    case MaybeType.Just: {
      f(m.value);
      return m;
    }
    case MaybeType.Nothing:
    default:
      return NothingImpl();
  }
};

const andThen = <A, B>(f: (arg0: A) => Maybe<B>, m: Maybe<A>): Maybe<B> => {
  switch (m.type) {
    case MaybeType.Just:
      return f(m.value);
    case MaybeType.Nothing:
    default:
      return NothingImpl();
  }
};

const of = <T>(value: T): Maybe<T> =>
  value === undefined || value === null ? NothingImpl() : JustImpl(value);

const withDefault = <T>(defaultValue: T, m: Maybe<T>): T => {
  switch (m.type) {
    case MaybeType.Just:
      return m.value;
    case MaybeType.Nothing:
    default:
      return defaultValue;
  }
};

const MaybeImpl = {
  andMap: curry(andMap),
  tap,
  andThen: curry(andThen),
  of,
  withDefault: curry(withDefault),
};

export default MaybeImpl;
