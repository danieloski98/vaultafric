import { AuthConfig, CustomerConfig, Data, Details, Meta, RequestType, TransactionConfig } from './props';
import { config } from 'dotenv';
import { md5 } from '../common/utils';

config();

export const getTransactionConfig = (transactionRef: string, customer: CustomerConfig, meta: Meta, details?: Details): TransactionConfig => {
  return {
    mock_mode: 'inspect',
    transaction_ref: transactionRef,
    transaction_desc: '',
    customer, meta, details
  };
}

/**
 * get Auth config with providing the type and secure parameters
 * @param type
 * @param secure
 */
export const getAuth = (type: string, secure: string): AuthConfig => {
  return {
    auth_provider: process.env.AUTH_PROVIDER,
    route_mode: null,
    secure,
    type
  };
}

export const getMetaConfig = (aKey?: string, anotherKey?: string): Meta => {
  return {
    a_key: aKey,
    another_key: anotherKey
  }
}

export const getOnePipeTransactionData = (requestRef: string, requestType: RequestType, authConfig: AuthConfig, transactionConfig: TransactionConfig): Data => {
  return {
    request_ref: requestRef,
    request_type: requestType,
    auth: authConfig,
    transaction: transactionConfig
  }
}

export const headers = (requestRef: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.API_KEY}`,
    Signature: md5(`${requestRef};${process.env.SECRET}`),
  }
}


