import { createHash, createCipheriv } from 'crypto';
import { config } from 'dotenv';

config();

function encrypt(text: string) {
  const bufferedKey = Buffer.from(process.env.SECRET!, 'utf16le');

  const key = createHash('md5').update(bufferedKey).digest();
  const newKey = Buffer.concat([key, key.slice(0, 8)]);
  const IV = Buffer.alloc(8, '\0');

  const cipher = createCipheriv('des-ede3-cbc', newKey, IV).setAutoPadding(
    true,
  );
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
}

export { encrypt };
