export declare type MaybeError = [Error, any];

export declare type MaybeResult<T> = [undefined, T];

interface IForIt<T> {
  (fn: Promise<T>): Promise<MaybeResult<T> | MaybeError>;
}

export const forit: IForIt<any> = async (fn) => {
  try {
    if (!fn) throw new Error("Absent fn");

    const result = await fn;

    return [undefined, result];
  } catch (e) {
    const error = e as Error;

    // NOTE: should we show the Response.text() text?

    if (e instanceof Error) return [e, undefined];
    if (e instanceof Response) return [new Error("Request failed"), e];
    if (typeof e !== "undefined")
      return [new Error(error?.message || "Error"), undefined];
    return [new Error("Unrecognized Error"), undefined];
  }
};
