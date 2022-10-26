export const formatInterval = (value: number, max = 2) => {
  const getIntervalValues = (
    interval: number,
    length: number
  ): [number, number] => {
    const amount = parseInt(String(interval / length), 10);
    const leftover = interval - amount * length;

    return [amount, leftover];
  };

  if (value < 0) return "no delay";

  const [w, leftD] = getIntervalValues(value, 604800);
  const [d, leftH] = getIntervalValues(leftD, 86400);
  const [h, leftM] = getIntervalValues(leftH, 3600);
  const [m, s] = getIntervalValues(leftM, 60);

  const parts = [w, d, h, m, s];
  const literals = ["w", "d", "h", "m", "s"];
  const formatted: string[] = [];

  parts.forEach((part, i) => {
    if (part && formatted.length < max) formatted.push(`${part}${literals[i]}`);
  });

  return formatted.join(" ");
};

export const expirationTimeToInterval = (
  expirationTime: number | undefined,
  tif: number
) => {
  if (!expirationTime) return tif;

  let delta = expirationTime * 1e3 - Date.now();
  delta = delta <= 0 ? 0 : Number((delta / 1e3).toFixed(0));

  return delta;
};

export const isFloat = (n: any) => !Number.isNaN(n) && n % 1 !== 0;
