import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { getSecure } from 'src/common/utils';
import {
  AuthType,
  CustomerConfig,
  AccountOpeningDetails,
  RequestType,
  OTPValidationData,
  AccountOpeningData,
  OnePipeResponse,
  ResponseStatus,
  BalanceData,
  AccountOption,
  AvailableLoanData,
  GetLoanDetails,
  LoanData,
  LoanStatus,
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
    details: AccountOpeningDetails,
    bvn: string,
  ): Promise<OnePipeResponse<AccountOpeningData>> {
    let result: OnePipeResponse<AccountOpeningData>;
    try {
      const url = buildUrl('transact');
      const secure = getSecure(process.env.SECRET, `${bvn}`);
      const auth = getAuth(AuthType.BankAccount, secure);
      const transactionConfig = getTransactionConfig(
        process.env.NODE_ENV === 'production' ? 'live' : 'inspect',
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

  async getBalance(
    options: AccountOption,
    customer: CustomerConfig,
  ): Promise<OnePipeResponse<BalanceData>> {
    let result: OnePipeResponse<BalanceData>;
    try {
      const url = buildUrl('transact');
      const secure = getSecure(
        process.env.SECRET,
        `${options.accountNumber};${options.bvn}`,
      );
      const auth = getAuth(AuthType.BankAccount, secure);
      const transactionConfig = getTransactionConfig(
        process.env.NODE_ENV === 'production' ? 'live' : 'inspect',
        {},
        'get account balance',
        {
          otp_override: true,
        },
        customer,
      );
      const requestRef = randomStringGenerator();
      const data = getOnePipeTransactionData(
        requestRef,
        RequestType.GetBalance,
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
            accountId: providerResponse.account_id,
            accountNumber: providerResponse.account_number,
            accountStatus: providerResponse.account_status,
            accountType: providerResponse.account_type,
            availableBalance: providerResponse.available_balance,
            minimumBalace: providerResponse.minimum_balance,
            ledgerBalance: providerResponse.ledger_balance,
            currency: providerResponse.currency,
            reference: providerResponse.reference,
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
        message: 'Get balance failed',
      };
    }
    return result;
  }

  async getAvailableLoan(
    customer: CustomerConfig,
  ): Promise<OnePipeResponse<AvailableLoanData>> {
    let result: OnePipeResponse<AvailableLoanData>;
    try {
      const url = buildUrl('transact', 'options');
      const auth = getAuth(null, null);
      const transactionConfig = getTransactionConfig(
        process.env.NODE_ENV === 'production' ? 'live' : 'inspect',
        {},
        'get loan options',
        {},
        customer,
      );
      const requestRef = randomStringGenerator();
      const data = getOnePipeTransactionData(
        requestRef,
        RequestType.GetLoan,
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
      if (responseData.status === ResponseStatus.OptionsDelivered) {
        const providerResponse = responseData.data.provider_response;
        result = {
          status: responseData.status,
          message: responseData.message,
          data: {
            provider: responseData.data.provider,
            providerResponseCode: responseData.data.provider_response_code,
            reference: providerResponse.reference,
            offers: providerResponse.offers.map((x: any) => {
              return {
                offerId: x.offer_id,
                offerExpiryDate: x.offer_expiry_date,
                loanAmount: x.loan_amount,
                loanFee: x.loan_fees,
                loanInterestPercent: x.loan_interest_percent,
                lenderCode: x.lender_code,
                lenderName: x.lender_name,
                lenderTermsUrl: x.lender_terms_url,
                lenderProductCode: x.lender_product_code,
              };
            }),
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
        message: 'Failed to get available loans',
      };
    }
    return result;
  }

  async requestLoan(
    customer: CustomerConfig,
    options: AccountOption,
    details: GetLoanDetails,
  ): Promise<OnePipeResponse<LoanData>> {
    let result: OnePipeResponse<LoanData>;
    try {
      const url = buildUrl('transact');
      const secure = getSecure(
        process.env.SECRET,
        `${options.accountNumber};${options.bvn}`,
      );
      const auth = getAuth(AuthType.BankAccount, secure);
      const transactionConfig = getTransactionConfig(
        process.env.NODE_ENV === 'production' ? 'live' : 'inspect',
        {},
        'request for loan',
        details,
        customer,
      );
      const requestRef = randomStringGenerator();
      const data = getOnePipeTransactionData(
        requestRef,
        RequestType.GetLoan,
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
            transactionFinalAmount: providerResponse.transaction_final_amount,
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
        message: 'Failed to get loan',
      };
    }
    return result;
  }

  async getLoanStatus(
    customer: CustomerConfig,
  ): Promise<OnePipeResponse<LoanStatus>> {
    let result: OnePipeResponse<LoanStatus>;
    try {
      const url = buildUrl('transact');
      const auth = getAuth(null, null);
      const transactionConfig = getTransactionConfig(
        process.env.NODE_ENV === 'production' ? 'live' : 'inspect',
        {},
        'get loan status',
        null,
        customer,
      );
      const requestRef = randomStringGenerator();
      const data = getOnePipeTransactionData(
        requestRef,
        RequestType.GetLoan,
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
            loans: providerResponse.loans.map((x: any) => {
              return {
                accountNumber: x.account_number,
                accountName: x.account_name,
                bankName: x.bank_name,
                bankCode: x.bank_code,
                loanDate: x.loan_date,
                loanInterestAmount: x.loan_interest_amount,
                loanDueAmount: x.loan_due_amount,
                loanDueDate: x.loan_due_date,
                loanAmount: x.loan_amount,
                loanFee: x.loan_fees,
                loanInterestPercent: x.loan_interest_percent,
                lenderCode: x.lender_code,
                lenderName: x.lender_name,
                lenderTermsUrl: x.lender_terms_url,
              };
            }),
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
        message: 'Failed to get loans status',
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
        process.env.NODE_ENV === 'production' ? 'live' : 'inspect',
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
