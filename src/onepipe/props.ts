export interface CustomerConfig {
  customer_ref: string;
  firstname: string;
  surname: string;
  email: string;
  mobile_no: string;
}

export interface TransactionConfig {
  mock_mode: 'live' | 'inspect';
  transaction_ref: string;
  transaction_desc?: string;
  transaction_ref_parent?: string;
  amount?: 0;
  customer?: CustomerConfig;
  meta?: Meta;
  details?: Details;
}

export interface AuthConfig {
  type?: string;
  secure?: string;
  auth_provider?: string;
  route_mode?: string;
}

export interface Meta {
  a_key?: string;
  another_key?: string;
}

export interface Details {
  name_on_account?: string;
  middlename?: string;
  dob?: string;
  gender?: 'M' | 'F';
  title?: 'Mr' | 'Mrs' | 'Ms';
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: 'NG';
}

export interface Data {
  request_ref: string;
  request_type: RequestType;
  auth: AuthConfig;
  transaction: TransactionConfig;
}

export enum RequestType {
  OpenAccount = 'open_account',
  GetBalance = 'get_balance',
  Collect = 'collect',
}

export enum AuthType {
  BankAccount = 'bank.account',
  Card = 'card',
  Wallet = 'wallet',
  Custom = 'custom',
  Voucher = 'voucher',
  airtime = 'airtime',
  bankTransfer = 'bank.transfer',
}

export enum ResponseStatus {
  Successful = 'Successful',
  WaitingForOTP = 'WaitingForOTP',
  PendingValidation = 'PendingValidation',
  Failed = 'Failed',
}

export interface OnePipeResponse<T> {
  status: ResponseStatus;
  message: string;
  data?: T;
}

export interface AccountOpeningData {
  providerResponseCode: string;
  provider: string;
  reference: string;
  accountNumber: string;
  accountReference: string;
  accountName: string;
  contractCode: string;
  currencyCode: string;
  bankName: string;
  bankCode: string;
  status: string;
  createdOn: string;
  accountType: string;
}

export interface OTPValidationData {
  providerResponseCode: string;
  provider: string;
  chargeToken: string;
  paymentOptions: [];
}
