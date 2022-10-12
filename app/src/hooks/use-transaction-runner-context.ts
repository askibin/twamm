import { useContext } from "react";
import { RunnerContext } from "../contexts/transaction-runner-context";
/*
 *import Maybe from "../types/maybe";
 *
 *const applyProviderIfAbsent = curry((ctx, isAbsent, provider) => {
 *  if (isAbsent) ctx.setProvider(provider);
 *
 *  return ctx.provider;
 *});
 */

export const useTxRunnerContext = () => {
  const context = useContext(RunnerContext);
  if (context === undefined) {
    throw new Error("Transaction runner context required");
  }

  /*
   *  const applyProvider = applyProviderIfAbsent(context);
   *
   *  // @ts-ignore
   *  const setProvider = Maybe.andThen(applyProvider, Maybe.of(!context.provider));
   *
   *  // @ts-ignore
   *  Maybe.andThen(setProvider, Maybe.of(program.provider));
   */

  return context;
};
