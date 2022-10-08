interface JustData<T> {
  type: typeof MaybeType.Just;
  data: T;
}

interface NothingData<E> {
  type: typeof MaybeType.Nothing;
  error: E;
}

declare type MaybeData<T, E> = JustData<T> | NothingData<E>;
