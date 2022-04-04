import { createHash } from 'crypto';
import { DateTime } from 'luxon';

export const md5 = (text: string) => {
  return createHash('md5').update(text).digest('hex');
}

export const isExpired = (milliSeconds: number) => {
  const currentMillisecond = getExpiration(0);
  return milliSeconds > currentMillisecond;
}

export const getExpiration = (minute: number): number => {
  return DateTime.now().plus({minute}).toMillis();
}