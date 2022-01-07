import { BadRequestException, Injectable, Logger, UseGuards } from '@nestjs/common';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entity/user.entity';
import { FixedDepositDto } from './dto/fixed-deposit.dto';
import { FixedDeposit } from './fixed-deposit.entity';
import { FixedDepositRepository } from './fixed-deposit.repository';
import { Duration } from '../../plan/base-plan';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawDto } from './dto/withdraw.dto';
import { MoreThan } from 'typeorm';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Injectable()
export class FixedDepositService {

  private readonly logger = new Logger(FixedDepositService.name, true);

  constructor(
    @InjectRepository(FixedDepositRepository)
    private repository: FixedDepositRepository
  ) {}

  async deposit(user: User, fixedDepositDto: FixedDepositDto): Promise<void> {
    this.logger.log(`Create fixed deposit savings`);
    
    const { name, amount, duration } = fixedDepositDto;
    const { start, end } = await FixedDepositService.getStartEndDate(duration);

    if(start > end) {
      throw new BadRequestException(`Invalid date selection`);
    }

    const deposit = await this.repository.create({name, amount, duration, start, end, user });

    await this.repository.save(deposit)
  }

  // TODO - work on the conditions for start and end dates { yearly, month, etc }
  private static async getStartEndDate(duration: Duration): Promise<{start: Date, end: Date}> {
    duration.toUpperCase();
    return { start: new Date(), end: new Date() }
  }

  async getDeposits(user: User): Promise<FixedDeposit[]> {
    return this.repository.find({user});
  }

  // TODO: this will be in sync with 3rd party API
  async withdraw(user:User, withdrawDto: WithdrawDto): Promise<FixedDeposit | undefined> {
    const deposit = await this.repository.findOne({
      select: ['id', 'amount'],
      where: { user, amount: MoreThan(withdrawDto.amount), }
    });

    if(!deposit) throw new BadRequestException('Insufficient balance')

    deposit.amount -= withdrawDto.amount;

    await this.repository.save(deposit);

    return deposit;
  }

  async deleteDeposit(user: User, id: string): Promise<void> {
    await this.repository.delete({ user, id });
  }
}