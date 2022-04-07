import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { getSecure } from 'src/common/utils';
import {
  AuthType,
  CustomerConfig,
  Details,
  RequestType,
  OTPValidationData,
  AccountOpeningData,
  OnePipeResponse,
  ResponseStatus,
} from './props';
import {
  getAuth,
  getOnePipeTransactionData,
  getTransactionConfig,
  buildUrl,
  headers,
} from './utility';

config();

@Injectable()
export class OnePipeService {
  private readonly logger = new Logger(OnePipeService.name, true);

  constructor(private httpService: HttpService) {}

  async openAccount(
    options: CustomerConfig,
    details: Details,
    bvn: string,
  ): Promise<OnePipeResponse<AccountOpeningData>> {
    let result: OnePipeResponse<AccountOpeningData>;
    try {
      const url = buildUrl('transact');
      const secure = getSecure(process.env.SECRET, `${bvn}`);
      const auth = getAuth(AuthType.BankAccount, secure);
      const transactionConfig = getTransactionConfig(
        'inspect',
        {},
        'account opening',
        details,
        options,
      );
      const requestRef = randomStringGenerator();
      const data = getOnePipeTransactionData(
        requestRef,
        RequestType.OpenAccount,
        auth,
        transactionConfig,
      );
      const header = headers(requestRef);

      const response = await this.httpService
        .post(url, data, {
          headers: header,
        })
        .toPromise();

      const responseData = response.data;

      if (responseData.status === ResponseStatus.Successful) {
        const providerResponse = responseData.data.provider_response;
        result = {
          status: responseData.status,
          message: responseData.message,
          data: {
            provider: responseData.data.provider,
            providerResponseCode: responseData.data.provider_response_code,
            reference: providerResponse.reference,
            accountNumber: providerResponse.account_number,
            contractCode: providerResponse.contract_code,
            accountReference: providerResponse.account_reference,
            accountName: providerResponse.account_name,
            currencyCode: providerResponse.currency_code,
            bankName: providerResponse.bank_name,
            bankCode: providerResponse.bank_code,
            accountType: providerResponse.account_type,
            status: providerResponse.status,
            createdOn: providerResponse.created_on,
          },
        };
      } else
        result = {
          status: responseData.status,
          message: responseData.message,
        };
    } catch (error) {
      this.logger.error(error);
      result = {
        status: ResponseStatus.Failed,
        message: 'Failed to create account',
      };
    }
    return result;
  }

  async validateOTP(
    options: CustomerConfig,
    authType: AuthType,
    otp: string,
  ): Promise<OnePipeResponse<OTPValidationData>> {
    let result: OnePipeResponse<OTPValidationData>;
    try {
      const url = buildUrl('transact', 'validate');
      const secure = getSecure(process.env.SECRET, `${otp}`);
      const auth = getAuth(authType, secure);
      const transactionConfig = getTransactionConfig(
        'inspect',
        {},
        'validate otp',
      );
      const requestRef = randomStringGenerator();
      const data = {
        ...getOnePipeTransactionData(
          requestRef,
          RequestType.Collect,
          auth,
          transactionConfig,
        ),
        customer: options,
      };

      const header = headers(requestRef);

      const response = await this.httpService
        .post(url, data, {
          headers: header,
        })
        .toPromise();

      const responseData = response.data;
      if (responseData.status === ResponseStatus.Successful)
        result = {
          status: responseData.status,
          message: responseData.message,
          data: {
            provider: responseData.data.provider,
            providerResponseCode: responseData.data.provider_response_code,
            chargeToken: responseData.data.charge_token,
            paymentOptions: responseData.data.paymentoptions,
          },
        };
      else
        result = {
          status: responseData.status,
          message: responseData.message,
        };
    } catch (error) {
      this.logger.error(error);
      result = {
        status: ResponseStatus.Failed,
        message: 'OTP validation failed',
      };
    }
    return result;
  }
}
