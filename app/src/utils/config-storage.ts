export const sanidateURL = (addr: string | undefined): string | Error => {
  const error = new Error("Address should be a http(s) URL");

  if (!addr) return error;

  const address = addr.trim();

  let result;
  try {
    const url = new URL(address);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error();
    }
    result = url.href;
  } catch (e) {
    return error;
  }

  return result;
};

export const sanidateString = (str: string | undefined): number | Error => {
  const error = new Error("Wrong value");

  if (!str) return error;

  const value = str.trim();

  let result;
  try {
    const number = Number(value);

    if (Number.isNaN(number)) {
      throw new Error();
    }
    result = number;
  } catch (e) {
    return error;
  }

  return result;
};

export default function storage({
  key,
  enabled,
  sanidate,
}: {
  key: string;
  enabled: string;
  sanidate: (arg0: string | undefined) => any | Error;
}) {
  const STORAGE_KEY = key;
  const ENABLE_STORAGE_KEY = enabled;

  const self = {
    disable() {
      if (global.localStorage) {
        global.localStorage.removeItem(ENABLE_STORAGE_KEY);
        global.localStorage.removeItem(STORAGE_KEY);
      }
    },
    enable() {
      if (global.localStorage) {
        global.localStorage.setItem(ENABLE_STORAGE_KEY, "1");
      }
    },
    enabled() {
      if (global.localStorage) {
        return global.localStorage.getItem(ENABLE_STORAGE_KEY) === "1";
      }

      return false;
    },
    get(): string | undefined {
      if (global.localStorage) {
        const addr = global.localStorage.getItem(STORAGE_KEY);

        if (!addr) return undefined;

        const addrOrError = sanidate(decodeURI(addr));

        if (addrOrError instanceof Error) {
          self.disable();
          return undefined;
        }

        return addrOrError;
      }
      return undefined;
    },
    set(value: string | undefined): undefined | Error {
      if (!value) return new Error("Absent value");
console.log("option stirave", value)
      const addrOrError = sanidate(encodeURI(value));

      if (addrOrError instanceof Error) return addrOrError;

      if (globalThis.localStorage) {
        self.enable();
        globalThis.localStorage.setItem(STORAGE_KEY, addrOrError);
        console.log("option 345345345345", addrOrError)
        return undefined;
      }
      return new Error("Value is set but not stored");
    },
  };

  return self;
}
