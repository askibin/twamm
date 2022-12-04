import type { PublicKey } from "@solana/web3.js";
import { flatten, splitEvery } from "ramda";

const MAX_MULTIPLE = 5;

export const fetchMultipleAddresses = async <T = any>(
  fetchMultiple: (arg0: Array<any>) => Promise<Array<T>>,
  addresses: PublicKey[]
) => {
  const addrStrings = addresses.map((a) => a.toBase58());
  const uniqAddresses = Array.from(new Set(addrStrings));
  const addrGroups = splitEvery(MAX_MULTIPLE, uniqAddresses);

  const results = [];

  for (let i = 0; i <= addrGroups.length - 1; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const eachResult = await fetchMultiple(addrGroups[i]);

    results.push(eachResult);
  }

  if (addresses.length === uniqAddresses.length) {
    return flatten(results);
  }

  const resultMap = new Map();
  flatten(results).forEach((res, index) => {
    resultMap.set(uniqAddresses[index], res);
  });

  const all = addrStrings.map((address) => resultMap.get(address));

  return all;
};
