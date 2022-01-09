import { BadRequestException, Injectable, Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/entity/user.entity';
import { FixedDepositDto } from './dto/fixed-deposit.dto';
import { FixedDeposit } from './fixed-deposit.entity';
import { FixedDepositRepository } from './fixed-deposit.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawDto } from './dto/withdraw.dto';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Injectable()
export class FixedDepositService {

  private readonly logger = new Logger(FixedDepositService.name, true);

  constructor(
    @InjectRepository(FixedDepositRepository)
    private repository: FixedDepositRepository
  ) {}

  async deposit(user: User, fixedDepositDto: FixedDepositDto, imageBuffer?: Buffer) {
    this.logger.log(`Create fixed deposit savings`);

    if(imageBuffer) {
      this.logger.log(`Avatar file found - converting to base 64 string`);
      fixedDepositDto.avatar = imageBuffer.toString('base64');
    }
    
    const { name, amount, start, end, avatar } = fixedDepositDto;

    if(start > end) {
      this.logger.error(`Invalid date selection: start: ${start}, end: ${end}`)
      throw new BadRequestException(`Invalid date selection`);
    }

    try {
      const deposit = await this.repository.create({ name, amount, start, end, avatar, user });
      await this.repository.save(deposit);
    }catch (e) {
      this.logger.error(`Error creating fixed deposit plan. ${e.message}`);
      throw new BadRequestException(`Could not create fixed deposit plan.`);
    }
    this.logger.log(`Fixed deposit plan started`);

    return {message: `'${name}' plan is now active`};
  }

  async getDeposits(user: User): Promise<FixedDeposit[]> {
    this.logger.log(`Fetch all records of fixed deposit...`);

    const savingsPlan = await this.repository.find({user});
    if(!savingsPlan) {
      this.logger.error(`Fixed deposit record not found.`);
      throw new NotFoundException(`Fixed deposit record not found`);
    }

    this.logger.log(`...fixed deposit records found`);
    return savingsPlan;
  }

  // TODO: this will be in sync with 3rd party API
  async withdraw(user:User, withdrawDto: WithdrawDto): Promise<{ message: string}> {
    this.logger.log(`Withdrawal initiated for fixed deposit`)
    const { id, amount } = withdrawDto;

    const deposit = await this.repository.findOne({
      where: { user, id },
      select: ['id', 'balance']
    });

    if(deposit.balance < amount){
      this.logger.error(`Insufficient balance`);
      throw new BadRequestException('Insufficient balance')
    }

    deposit.balance -= amount;
    await this.repository.save(deposit);

    this.logger.log(`withdraw completed`);

    return {message: `Your withdrawal is being processed`};
  }

  // TODO: this will be in sync with 3rd party API
  async deleteDeposit(user: User, id: string): Promise<{message: string}> {
    this.logger.log(`Delete fixed deposit plan`);

    const fdPlan = await this.repository.findOne({ user, id });

    if(!fdPlan) {
      this.logger.error(`Fixed deposit plan not found`);
      throw new NotFoundException(`Could not find fixed deposit plan`);
    }
    await this.repository.delete(fdPlan);

    this.logger.log(`Fixed deposit plan '${fdPlan.name}' deleted`);

    return {message: `'${fdPlan.name}' has been deleted`};
  }
}