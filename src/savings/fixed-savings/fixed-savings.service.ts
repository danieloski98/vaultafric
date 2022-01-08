import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings.repository';
import { User } from '../../auth/entity/user.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { UpdatedFixedSavingsDto } from './dto/updated-fixed-savings.dto';
import { FixedSavings } from './fixed-savings.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { ProfileRepository } from '../../auth/repository/profile.repository';

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

    if(avatar) {
      fixedSavingsDto.avatar = avatar.toString('base64');
    }

    const { start, end, name, occurrence } = fixedSavingsDto;

    if(start > end) {
      this.logger.error(`Invalid date selection: start: ${start}, end: ${end}`)
      throw new BadRequestException(`Invalid date selection`);
    }

    this.logger.log(`Does plan with same name and occurrence exist?...`)
    const plan = await this.fixedSavingsRepository.findOne({
      where: { isActive: true, name, occurrence }
    });

    if(plan) {
      this.logger.error(`...fixed plan exist.`);
      throw new BadRequestException(`'${name}' savings plan exist`)
    }

    this.logger.log(`Save new fixed plan...`);
    await this.fixedSavingsRepository.newSavings(user, fixedSavingsDto);

    this.logger.log(`...'${name}' savings plan is now active.`);

    return { message: `'${name}' savings plan is now active` };
  }

  async updateSavings(updateDeposit: UpdatedFixedSavingsDto): Promise<void> {
    const fixedSavings = await this.fixedSavingsRepository.findOne({ id:updateDeposit.id });

    if(!fixedSavings) throw new NotFoundException('Could not update Fixed Deposit entry. Please try again.');

    const properties = Object.keys(updateDeposit).filter(prop => prop != undefined);

    for (const property of properties) {
      fixedSavings[property] = updateDeposit[property];
    }

    await fixedSavings.save();
  }

  async deleteSavings(user: User, id: string) {
    const plan = await this.fixedSavingsRepository.findOne({ where: {user, id} });

    if(!plan) {
      throw new NotFoundException(`Savings plan not found`);
    }

    if(plan.isActive) {
      throw new BadRequestException(`Cannot delete an active savings plan.`);
    }

    await this.fixedSavingsRepository.delete(plan)
    return { message: `Fixed savings deleted` };
  }

  async getSavings(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.find({
      where: { user },
      select: ['id', 'name', 'start', 'end', 'balance', 'amount', 'isActive', 'isElapsed', 'occurrence']
    });
  }

  async getSavingsById(user: User, id: string): Promise<FixedSavings> {
    return this.fixedSavingsRepository.findOne({
      where: { user, id }
    });
  }

  getCompletedFixedSavings(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.find({
      where: { isElapsed: true, isActive: false, user }
    });
  }

  getActiveSavings(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.find({
      where: { user, isActive: true },
      select: ['id', 'name', 'start', 'end', 'balance', 'amount', 'isActive', 'isElapsed', 'occurrence']
    });
  }

  getInactiveSavings(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.find({
      where: { user, isActive: false },
      select: ['id', 'name', 'start', 'end', 'balance', 'amount', 'isActive', 'isElapsed', 'occurrence']
    });
  }

  async stop(user: User, id: string): Promise<{ message: string }> {
    const plan = await this.fixedSavingsRepository.findOne({ where: {user, id} });

    if(!plan) {
      throw new NotFoundException(`Fixed savings plan not found`);
    }

    await this.fixedSavingsRepository.save({ id, isActive: false });

    return {message: `'${plan.name}' fixed savings plan stopped`};
  }

  async withdrawSavings(user: User, withdrawDto: WithdrawDto): Promise<{ message: string }> {
    this.logger.log(`Withdraw from savings...`);

    const  {id, amount, pin} = withdrawDto;

    const savingsPlan = await this.fixedSavingsRepository.findOne({
      where: { user, id },
      select: ['id', 'balance', 'amount', 'isActive', 'isElapsed']
    });

    const profile = await this.profileRepository.findOne({
      where: {user},
      select: ['id', 'pin']
    });

    if(profile.pin !== pin) {
      this.logger.error(`Transaction pin did not match`);
      throw new BadRequestException(`Transaction pin match failed`);
    }

    if(!savingsPlan) {
      this.logger.error(`Savings plan not found`)
      throw new NotFoundException(`Error retrieving savings plan`);
    }

    if(savingsPlan.balance < amount) {
      this.logger.error(`Requested amount is greater than balance`)
      throw new BadRequestException(`Insufficient balance`);
    }

    // TODO get bank details, perform withdraw

    savingsPlan.amount -= amount;
    await this.fixedSavingsRepository.save(savingsPlan);

    return { message: `Your withdrawal is being processed` };
  }
}