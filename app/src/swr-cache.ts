export function localStorageProvider() {
  if (!globalThis.localStorage) return new Map<any, any>([]);

  const map = new Map<any, any>(
    JSON.parse(globalThis.localStorage?.getItem("app-cache") || "[]")
  );

  globalThis?.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    globalThis.localStorage.setItem("app-cache", appCache);
  });

  return map;
}
