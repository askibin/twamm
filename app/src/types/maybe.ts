import { curry } from "ramda";

import type { Maybe, Just, Nothing } from "./maybe.d";
import { MaybeType } from "./maybe.d";

const NothingImpl = (): Nothing => ({
  type: MaybeType.Nothing,
});

const JustImpl = <T>(value: T): Just<T> => ({
  type: MaybeType.Just,
  value: value as Exclude<T, undefined | null>,
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

const consume = <A, B>(f: (arg0: A) => B, m: Maybe<A>): B | undefined => {
  switch (m.type) {
    case MaybeType.Just:
      return f(m.value);
    case MaybeType.Nothing:
    default:
      return undefined;
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
  andMap,
  andThen,
  consume,
  of,
  tap, // uncurried due to unknown type
  withDefault, // uncurried,
};

export default MaybeImpl;

export const MaybeC = {
  andMapC: curry(andMap),
  andThenC: curry(andThen),
};

const as = <A, B>(f: (arg0: Maybe<A>) => Maybe<B>, m: Maybe<A>): Maybe<B> => {
  switch (m.type) {
    case MaybeType.Just: {
      return f(m);
    }
    case MaybeType.Nothing:
    default:
      return NothingImpl();
  }
};

const combine = <A>(m: Array<Maybe<A>>): Maybe<Array<A>> => {
  const list: Array<A> = [];
  let isNothing = false;

  m.forEach((mb) => {
    if (isNothing) return;
    const res = MaybeImpl.consume<A, A>((x) => x, mb);

    if (!res) isNothing = true;
    else list.push(res);
  });

  if (!isNothing) return JustImpl(list);
  return NothingImpl();
};

export const Extra = {
  as,
  combine,
  isJust: <T>(m: Maybe<T>): boolean => m.type === MaybeType.Just,
  isNothing: <T>(m: Maybe<T>): boolean => m.type === MaybeType.Nothing,
};
