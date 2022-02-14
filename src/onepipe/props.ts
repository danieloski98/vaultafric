export interface CustomerConfig {
  customer_ref: string,
  firstname: string,
  surname: string,
  email: string,
  mobile_no: string
}

export interface TransactionConfig {
  mock_mode: ('live' | 'inspect'),
  transaction_ref: string,
  transaction_desc?: string,
  transaction_ref_parent?: string,
  amount?: 0,
  customer: CustomerConfig,
  meta: Meta,
  details: Details
}

export interface AuthConfig {
  type?: string,
  secure?: string,
  auth_provider?: string;
  route_mode?: string
}

export interface Meta {
  a_key?: string,
  another_key?: string
}

export interface Details {
  name_on_account?: string,
  middlename?: string,
  dob?: string,
  gender?: ('M' | 'F'),
  title?: ('Mr' | 'Mrs' | 'Ms'),
  address_line_1?: string,
  address_line_2?: string,
  city?: string,
  state?: string,
  country?: 'NG'
}

export interface Data {
  request_ref: string,
  request_type: RequestType,
  auth: AuthConfig,
  transaction: TransactionConfig
}

export enum RequestType {
  OpenAccount = 'open_account',
  GetBalance = 'get_balance'
}