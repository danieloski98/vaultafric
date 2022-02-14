import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { CustomerConfig, Details, RequestType } from './props';
import { HttpService } from '@nestjs/axios';
import { getAuth, getOnePipeTransactionData, getTransactionConfig, headers } from './utility';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import axios from 'axios'
import { map } from 'rxjs/operators';

config();

@Injectable()
export class OnePipeService {
  private readonly logger = new Logger(OnePipeService.name, true);

  constructor(private httpService: HttpService) {}

  async openAccount(options: CustomerConfig, details: Details){
    const url = `${process.env.URL}/transact`;
    const requestRef = randomStringGenerator();
    const transactionRef = randomStringGenerator();

    const transactionConfig = getTransactionConfig(transactionRef, options, {}, details);
    const auth = getAuth(null,  null);

    const data = getOnePipeTransactionData(requestRef, RequestType.OpenAccount, auth, transactionConfig)

    this.logger.log(`Reachout to onepipe api`)

    // try {
    //   const response = await axios.post(url, data, {
    //     headers: headers(requestRef),
    //     method: 'POST'
    //   });
    //
    //   this.logger.log(response)
    // }catch (e) {
    //   this.logger.error(`An error occurred ${e.message}`)
    // }

    // this.httpService.post(url, data, {
    //   headers: headers(requestRef),
    //   method: 'POST'
    // }).pipe(map((response) => {
    //   this.logger.log(response.data)
    // }));

  }
}
