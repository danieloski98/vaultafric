import {
  AuthConfig,
  AuthType,
  CustomerConfig,
  Data,
  Details,
  Meta,
  RequestType,
  TransactionConfig,
} from './props';
import {
  apiKey,
  authProvider,
  baseUrl,
  secret,
  transactionRef,
} from './config';
import { md5 } from '../common/utils';

export const buildUrl = (...paths: string[]): string => {
  return `${baseUrl}/${paths.join('/')}`;
};

export const getTransactionConfig = (
  mode: 'inspect' | 'live',
  meta: Meta,
  desc?: string,
  details?: Details,
  customer?: CustomerConfig,
): TransactionConfig => {
  return {
    mock_mode: mode,
    transaction_ref: transactionRef,
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
    auth_provider: authProvider,
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
    Authorization: `Bearer ${apiKey}`,
    Signature: md5(`${requestRef};${secret}`),
  };
};
