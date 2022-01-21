import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings/fixed-savings.repository';
import { FixedDepositRepository } from './fixed-deposit/fixed-deposit.repository';
import { JointSavingsRepository } from './joint-savings/joint-savings.repository';

@Injectable()
export class SavingsService {
  private readonly logger = new Logger(SavingsService.name, true);

  constructor(
    @InjectRepository(FixedSavingsRepository)
    private fixedSavingsRepository: FixedSavingsRepository,

    @InjectRepository(FixedDepositRepository)
    private fixedDepositRepository: FixedDepositRepository,

    @InjectRepository(JointSavingsRepository)
    private jointSavingsRepository: JointSavingsRepository
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
}