import { createHash } from 'crypto';

export const md5 = (text: string) => {
  return createHash('md5').update(text).digest('hex');
}