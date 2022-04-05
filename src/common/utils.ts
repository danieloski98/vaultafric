import { createHash, createCipheriv } from 'crypto';
import { DateTime } from 'luxon';

export const md5 = (text: string) => {
  return createHash('md5').update(text).digest('hex');
};

export const isExpired = (milliSeconds: number) => {
  const currentMillisecond = getExpiration(0);
  return milliSeconds > currentMillisecond;
};

export const getExpiration = (minute: number): number => {
  return DateTime.now().plus({ minute }).toMillis();
};

export const getSecure = (secretKey: string, textToEncrypt: string): string => {
  const bufferedKey = Buffer.from(secretKey, 'utf16le');

  const key = createHash('md5').update(bufferedKey).digest();
  const newKey = Buffer.concat([key, key.slice(0, 8)]);
  const iv = Buffer.alloc(8, '\0');

  const cipher = createCipheriv('des-ede3-cbc', newKey, iv).setAutoPadding(
    true,
  );

  return (
    cipher.update(textToEncrypt, 'utf8', 'base64') + cipher.final('base64')
  );
};
