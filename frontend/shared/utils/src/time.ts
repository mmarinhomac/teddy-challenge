import * as moment from 'moment-timezone';

export const getRemainingDays = (
  date: string,
  timezone: string = moment.tz.guess()
): number => {
  if (!date) return 0;

  const endDate = moment.tz(date, timezone);
  const now = moment.tz(timezone);
  const remainingTime = endDate.diff(now);

  if (remainingTime < 0) return 0;

  const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));
  return remainingDays;
};

export const debounceTimeout = (
  key: string,
  callback: () => void,
  delay: number,
  namespace: string = 'appDataLayer'
) => {
  if (!key || !callback || !delay) return;

  const globalAny = window as any;
  const layer = globalAny[namespace] || {};
  const currentTimeouts = layer.customTimeout || {};

  // clear previous timeout
  if (currentTimeouts[key]) {
    clearTimeout(currentTimeouts[key]);
  }

  const time = setTimeout(callback, delay);

  globalAny[namespace] = {
    ...layer,
    customTimeout: {
      ...currentTimeouts,
      [key]: time,
    },
  };
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
