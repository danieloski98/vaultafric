import { Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings.repository';
import { User } from '../../auth/entity/user.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { UpdatedFixedSavingsDto } from './dto/updated-fixed-savings.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { ProfileRepository } from '../../auth/repository/profile.repository';
import { InvalidDateException } from '../../exception/invalid-date.exception';
import { TransactionPinMismatchException } from '../../exception/transaction-pin-mismatch.exception';
import { InsufficientBalanceException } from '../../exception/insufficient-balance.exception';
import {
  DuplicateFixedSavingsException,
  FixedSavingsDeleteException,
  FixedSavingsNotFoundException,
} from '../../exception/fixed-savings.exception';
import { InvalidWithdrawAmountException } from '../../exception/invalid-withdraw-amount.exception';

@Injectable()
export class FixedSavingsService {

  private readonly logger = new Logger(FixedSavingsService.name, true);

  constructor(
    @InjectRepository(FixedSavingsRepository)
    private fixedSavingsRepository: FixedSavingsRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository
  ) {}

  async createSavings(user: User, fixedSavingsDto: FixedSavingsDto, avatar?: Buffer) {
    this.logger.log(`Create new fixed savings plan...`);

    const { start, end, name, occurrence } = fixedSavingsDto;

    if(start > end) {
      this.logger.error(`Invalid date selection: start: ${start}, end: ${end}`)
      throw new InvalidDateException();
    }

    if(avatar) {
      this.logger.log(`Convert plan image to base64`);
      fixedSavingsDto.avatar = avatar.toString('base64');
    }

    this.logger.log(`Verify non-duplicate records for Fixed Savings plan`);
    const plan = await this.fixedSavingsRepository.findOne({
      where: { user, name, occurrence }
    });

    if(plan) {
      this.logger.error(`...fixed plan exist`);
      throw new DuplicateFixedSavingsException();
    }

    this.logger.log(`Create and start new Fixed Savings plan`);
    await this.fixedSavingsRepository.newSavings(user, fixedSavingsDto);

    this.logger.log(`...'${name}' savings plan is now active.`);
    return { message: `'${name}' savings plan is now active` };
  }

  async updateSavings(updateDeposit: UpdatedFixedSavingsDto) {
    this.logger.log(`Update fixed savings plan`);

    this.logger.log(`Fetch Fixed Savings plan...`)
    const fixedSavings = await this.fixedSavingsRepository.findOne({ id:updateDeposit.id });

    if(!fixedSavings) {
      this.logger.error(`Fixed savings plan not found`);
      throw new FixedSavingsNotFoundException();
    }

    const properties = Object.keys(updateDeposit).filter(prop => prop != undefined);

    this.logger.log(`Update Fixed Savings plan`);
    for (const property of properties) {
      fixedSavings[property] = updateDeposit[property];
    }

    await fixedSavings.save();
    this.logger.log(`Fixed savings plan updated`, fixedSavings.id);
    return {message: `Fixed Savings plan updated`};
  }

  async deleteSavings(user: User, id: string) {
    this.logger.log(`Delete Fixed savings`, id);
    const plan = await this.fixedSavingsRepository.findOne({ where: {user, id} });

    if(!plan) {
      this.logger.error(`Fixed Savings plan not found`);
      throw new FixedSavingsNotFoundException();
    }

    if(plan.isActive) {
      this.logger.error(`Fixed savings plan is active, cannot be deleted`);
      throw new FixedSavingsDeleteException();
    }

    await this.fixedSavingsRepository.delete(plan)

    this.logger.log(`Fixed Savings plan delete`, plan.id);

    return { message: `Fixed savings deleted` };
  }

  async getSavings(user: User) {
    this.logger.log(`Get all fixed savings`);

    return this.fixedSavingsRepository.find({
      where: { user },
      select: ['id', 'name', 'start', 'end', 'balance', 'amount', 'isActive', 'isElapsed', 'occurrence']
    });
  }

  async getSavingsById(user: User, id: string) {
    this.logger.log(`Get savings plan by id`);

    const plan = await this.fixedSavingsRepository.findOne({
      where: { user, id }
    });

    if(!plan) {
      this.logger.error(`Cannot find fixed savings record`);
      throw new FixedSavingsNotFoundException();
    }

    return plan;
  }

  getCompletedFixedSavings(user: User) {
    this.logger.log(`Get completed fixed savings plan by user`);

    return this.fixedSavingsRepository.find({
      where: { isElapsed: true, isActive: false, user }
    });
  }

  getActiveSavings(user: User) {
    this.logger.log(`Get active fixed savings plan for user`, user.id);
    return this.fixedSavingsRepository.find({
      where: { user, isActive: true },
      select: ['id', 'name', 'start', 'end', 'balance', 'amount', 'isActive', 'isElapsed', 'occurrence']
    });
  }

  getInactiveSavings(user: User) {
    this.logger.log(`Get inactive fixed savings plan`);

    return this.fixedSavingsRepository.find({
      where: { user, isActive: false },
      select: ['id', 'name', 'start', 'end', 'balance', 'amount', 'isActive', 'isElapsed', 'occurrence']
    });
  }

  async stop(user: User, id: string) {
    this.logger.log(`Stop fixed savings plan`);
    const plan = await this.fixedSavingsRepository.findOne({ where: {user, id} });

    if(!plan) {
      this.logger.error(`Fixed savings plan not found`);
      throw new FixedSavingsNotFoundException();
    }

    await this.fixedSavingsRepository.save({ id, isActive: false });
    this.logger.log(`Fixed savings plan stopped`, plan.id);

    return {message: `'${plan.name}' fixed savings plan stopped`};
  }

  async withdrawSavings(user: User, withdrawDto: WithdrawDto) {
    this.logger.log(`Withdraw from fixed savings...`);

    const  {id, amount, pin} = withdrawDto;

    if(amount == 0) {
      throw new InvalidWithdrawAmountException();
    }

    const savingsPlan = await this.fixedSavingsRepository.findOne({
      where: { user, id },
      select: ['id', 'balance', 'amount', 'isActive', 'isElapsed']
    });

    if(!savingsPlan) {
      this.logger.error(`Savings plan not found`)
      throw new FixedSavingsNotFoundException();
    }

    if(savingsPlan.balance < amount) {
      this.logger.error(`Requested amount is greater than balance`)
      throw new InsufficientBalanceException();
    }

    const profile = await this.profileRepository.findOne({
      where: {user}, select: ['pin']
    });

    if(profile.pin !== pin) {
      this.logger.error(`Transaction pin did not match`);
      throw new TransactionPinMismatchException();
    }

    // TODO get bank details, perform withdraw

    savingsPlan.amount -= amount;
    await this.fixedSavingsRepository.save(savingsPlan);
    this.logger.log(`Withdrawal is being processed`);

    return { message: `Your withdrawal is being processed` };
  }

  async getAccountBalance(id: string, user: User) {
    this.logger.log(`Get account balance for ${id}`);

    return this.fixedSavingsRepository.findOne({
      where: {id, user},
      select: ['id', 'balance']
    });
  }

  async updateAccountBalance(id: string, balance: number) {
    await this.fixedSavingsRepository.save({id, balance});
  }

  async getTotalBalance(user: User) {
    const fixedSavings = await this.fixedSavingsRepository.find({
      where: {user},
      select: ['balance']
    });

    let balance = 0;
    if(fixedSavings.length > 0) {
      fixedSavings.forEach(savings => balance += savings.balance);
    }

    return { balance };
  }
}