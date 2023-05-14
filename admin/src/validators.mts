import * as t from "io-ts";
import { either as Either } from "fp-ts";

const InitOpts = t.type({ minSignatures: t.number });
const SetAdminSignersOpts = t.type({ minSignatures: t.number });

export const init = (params: { minSignatures: string }) => {
  const dOptions = InitOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (Either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};

export const set_admin_signers = (params: { minSignatures: string }) => {
  const dOptions = SetAdminSignersOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (Either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};
