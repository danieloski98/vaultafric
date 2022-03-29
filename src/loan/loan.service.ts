import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from './loan.repository';
import { User } from '../auth/entity/user.entity';
import { LoanEntity } from './loan.entity';
import { LoanRequestDto } from './dto/loan-request.dto';
import { Duration } from '../plan/base-plan';
import { DateTime } from 'luxon';
import {config} from 'dotenv';
import { PayLoanDto } from './dto/pay-loan.dto';
import { ProfileRepository } from '../auth/repository/profile.repository';

config();

@Injectable()
export class LoanService {
  private readonly logger = new Logger(LoanService.name, true);

  constructor(
    @InjectRepository(LoanRepository)
    private loanRepository: LoanRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository
  ) {}

  async getHistory(user: User): Promise<LoanEntity[]> {
    this.logger.log(`Get loan history`);
    return await this.loanRepository.find({
      where: { user }
    })
  }

  async loanRequest(user: User, loanRequestDto: LoanRequestDto): Promise<{ message: string }> {
    this.logger.log(`New load request...`);

    const { duration, amount } = loanRequestDto;
    const {start, end} = this.getDateRange(duration);
    const serviceFee = +process.env.SERVICE_FEE;
    const limit = +process.env.LOAN_LIMIT;
    const balance = amount + (amount * serviceFee);

    this.logger.log(`Create loan request...`)
    const loanEntity = this.loanRepository.create({ user, balance, amount, start, end, serviceFee, limit });

    try {
      this.logger.log(`Save new loan request`)
      await this.loanRepository.save(loanEntity);
    }catch (err) {
      this.logger.error('Error creating new load request', err);
      throw new BadRequestException('Cannot process loan.')
    }

    return {message: `Loan request was successful and your account has been credited`};
  }

  async getBalance(user: User) {
    this.logger.log(`Get balance of loan`);

    const loanAccount = await this.loanRepository.findOne({
      where: {user},
      select: ['balance']
    });

    if(!loanAccount) {
      return { balance: 0 };
    }

    return { balance: loanAccount.balance };
  }

  private getDateRange(duration: Duration): {start: Date, end: Date} {
    this.logger.log(`Get date range for ${duration}`);

    const start = DateTime.now().toJSDate();
    let end: Date;

    switch (duration) {
      case Duration.TwoYears:
        end = DateTime.now().plus({year: 2}).toJSDate();
        break;
      case Duration.SixMonths:
        end = DateTime.now().plus({month: 6}).toJSDate();
        break;
      case Duration.ThreeMonths:
        end = DateTime.now().plus({month: 3}).toJSDate();
        break;
      case Duration.OneYear:
        end = DateTime.now().plus({year: 1}).toJSDate();
        break;
    }

    this.logger.log(`Date range calculated... ${start} - ${end}`)

    return {start, end};
  }

  async payLoan(user: User, payLoanDto: PayLoanDto) {
    this.logger.log(`Repay loan`);

    const { pin, amount, card } = payLoanDto;

    const profile = await this.profileRepository.findOne({
      where: [{user, pin}]
    });

    if(!profile) {
      throw new BadRequestException(`Invalid transaction pin`);
    }



  }
}
