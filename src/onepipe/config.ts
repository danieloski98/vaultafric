import { config } from 'dotenv';
config();

export const baseUrl: string | undefined = process.env.URL;
export const authProvider: string | undefined = process.env.AUTH_PROVIDER;
export const apiKey: string | undefined = process.env.API_KEY;
export const secret: string | undefined = process.env.SECRET;
export const transactionRef: string | undefined = process.env.TRANSACTION_REF;
