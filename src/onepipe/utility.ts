import {
  AuthConfig,
  AuthType,
  CustomerConfig,
  Data,
  AccountOpeningDetails,
  GetLoanDetails,
  Meta,
  RequestType,
  TransactionConfig,
} from './props';
import { md5 } from '../common/utils';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export const buildUrl = (...paths: string[]): string => {
  return `${process.env.URL}/${paths.join('/')}`;
};

export const getTransactionConfig = (
  mode: 'inspect' | 'live',
  meta: Meta,
  desc?: string,
  details?: AccountOpeningDetails | GetLoanDetails,
  customer?: CustomerConfig,
): TransactionConfig => {
  return {
    mock_mode: mode,
    transaction_ref: randomStringGenerator(),
    transaction_desc: desc,
    amount: 0,
    customer,
    meta,
    details,
  };
};

/**
 * get Auth config with providing the type and secure parameters
 * @param type
 * @param secure
 */
export const getAuth = (type: AuthType, secure: string): AuthConfig => {
  return {
    auth_provider: process.env.AUTH_PROVIDER,
    route_mode: null,
    secure,
    type,
  };
};

export const getMetaConfig = (aKey?: string, anotherKey?: string): Meta => {
  return {
    a_key: aKey,
    another_key: anotherKey,
  };
};

export const getOnePipeTransactionData = (
  requestRef: string,
  requestType: RequestType,
  authConfig: AuthConfig,
  transactionConfig: TransactionConfig,
): Data => {
  return {
    request_ref: requestRef,
    request_type: requestType,
    auth: authConfig,
    transaction: transactionConfig,
  };
};

export const headers = (
  requestRef: string,
): { Signature: string; Authorization: string; 'Content-Type': string } => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.API_KEY}`,
    Signature: md5(`${requestRef};${process.env.SECRET}`),
  };
};
