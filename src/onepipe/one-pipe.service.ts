import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { getSecure } from 'src/common/utils';
import { secret } from './config';
import {
  AuthType,
  CustomerConfig,
  Details,
  RequestType,
  AccountOpeningResponse,
  ResponseStatus,
  OTPValidationResponse,
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

  async openAccount(options: CustomerConfig, details: Details, bvn: string) {
    const url = buildUrl('v2', 'transact');
    const secure = getSecure(secret, `${bvn}`);
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

    const responseData = response.data as AccountOpeningResponse;
    if (responseData.status === ResponseStatus.Successful)
      this.logger.log('collect and save relevant data');
    else if (
      responseData.status === ResponseStatus.WaitingForOTP ||
      responseData.status === ResponseStatus.PendingValidation
    )
      this.logger.log('Collect otp data and perform validation');
    else this.logger.log('Transaction failed');
  }

  async validateOTP(options: CustomerConfig, otp: string) {
    const url = buildUrl('v2', 'transact', 'validate');
    const secure = getSecure(secret, `${otp}`);
    const auth = getAuth(AuthType.BankAccount, secure);
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

    const responseData = response.data as OTPValidationResponse;
    if (responseData.status === ResponseStatus.Successful)
      this.logger.log('continue to service');
    else this.logger.log('unable to validate otp');
  }
}
