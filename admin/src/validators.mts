import * as t from "io-ts";
import { Command } from "commander";
import { either as Either } from "fp-ts";

const InitOpts = t.type({ minSignatures: t.number });

export const init = (params: { minSignatures: string }, cli: Command) => {
  const dOptions = InitOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (Either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};
