import { Injectable, Logger } from '@nestjs/common';
import { User } from '../auth/entity/user.entity';
import { FixedSavingsService } from './fixed-savings/fixed-savings.service';
import { FixedDepositService } from './fixed-deposit/fixed-deposit.service';
import { JointSavingsService } from './joint-savings/joint-savings.service';
import { InsufficientBalanceException } from '../exception/insufficient-balance.exception';

@Injectable()
export class SavingsService {
  private readonly logger = new Logger(SavingsService.name, true);

  constructor(
    private fixedSavingsService: FixedSavingsService,
    private fixedDepositService: FixedDepositService,
    private jointSavingsService: JointSavingsService
  ) {}

  // async getAllSavingsBalance(user: User) {
  //   const fixedSavings = await this.fixedSavingsRepository.findOne({
  //     where: {user},
  //     select: ['balance']
  //   });
  //
  //   const fixedDeposit = await this.fixedDepositRepository.findOne({
  //     where: {user},
  //     select: ['balance']
  //   });
  //
  //   return fixedDeposit.balance + fixedSavings.balance;
  // }

  async getLatestTransaction() {
    this.logger.log(`Get the latest transactions of all savings plan`)
  }

  async getSavings(user: User, savingsId: string): Promise<Account> {
    this.logger.log(`Get Savings account using ${savingsId}`);

    let account: Account  = await this.fixedSavingsService.getAccountBalance(savingsId, user);

    if(!account) {
      account = await this.fixedDepositService.getAccountBalance(savingsId, user);
    }

    this.logger.log(`Savings account found ${JSON.stringify(account)}`);
    return account;
  }

  async updateSavingsAccount(user: User, accountUpdate: Account) {
    let account: Account;
    const {id, balance} = accountUpdate;

    account = await this.fixedDepositService.getAccountBalance(id, user);
    if (account) {
      await this.fixedDepositService.updateAccountBalance(id, balance);
      return;
    }
    
    if(!account) {
      account = await this.fixedSavingsService.getAccountBalance(id, user);
      await this.fixedSavingsService.updateAccountBalance(id, balance);
    }

  }

  async withdraw(user: User, savingsId: string, amount: number) {
    this.logger.log(`Withdraw from savings account: ${savingsId}`);

    const account = await this.getSavings(user, savingsId);
    if(amount > account.balance) {
      throw new InsufficientBalanceException();
    }
    account.balance -= amount;

    await this.updateSavingsAccount(user, account);
  }
}

interface Account {
  id: string;
  balance: number
}