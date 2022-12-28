const sanidate = (addr: string | undefined): string | Error => {
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

export default function endpointStorage() {
  const STORAGE_KEY = "twammClusterEndpoint";
  const ENABLE_STORAGE_KEY = "twammEnableClusterEndpoint";

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
    set(endpoint: string | undefined): undefined | Error {
      console.log("CLS1, set", endpoint);
      if (!endpoint) return new Error("Absent address");

      const addrOrError = sanidate(encodeURI(endpoint));

      if (addrOrError instanceof Error) return addrOrError;

      if (globalThis.localStorage) {
        self.enable();
        globalThis.localStorage.setItem(STORAGE_KEY, addrOrError);
        return undefined;
      }
      return new Error("Address is set but not stored");
    },
  };

  return self;
}
