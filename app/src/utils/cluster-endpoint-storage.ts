export default function endpointStorage() {
  const STORAGE_KEY = "twammClusterEndpoint";
  const ENABLE_STORAGE_KEY = "twammEnableClusterEndpoint";

  const self = {
    disable() {
      if (global.localStorage) {
        global.localStorage.removeItem(ENABLE_STORAGE_KEY);
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
    get() {
      if (global.localStorage) {
        const uri = global.localStorage.getItem(STORAGE_KEY);
        return uri ? decodeURI(uri) : undefined;
      }
      return undefined;
    },
    set(endpoint: string) {
      if (globalThis.localStorage) {
        self.enable();
        globalThis.localStorage.setItem(
          STORAGE_KEY,
          encodeURI(endpoint.trim())
        );
      }
    },
  };

  return self;
}
