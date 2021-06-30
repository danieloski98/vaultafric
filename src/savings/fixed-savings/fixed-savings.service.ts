import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings.repository';
import { User } from '../../auth/user.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { UpdatedFixedSavingsDto } from './dto/updated-fixed-savings.dto';
import { FixedSavings } from './fixed-savings.entity';

@Injectable()
export class FixedSavingsService {

  constructor(
    @InjectRepository(FixedSavingsRepository)
    private fixedSavingsRepository: FixedSavingsRepository
  ) {}

  async createSavings(user: User, fixedDepositDto: FixedSavingsDto): Promise<void> {
    return this.fixedSavingsRepository.newSavings(user, fixedDepositDto);
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

  async deleteSavings(id: string): Promise<void> {
    const fixedDeposit = await this.fixedSavingsRepository.findOne({id});
    await this.fixedSavingsRepository.delete(fixedDeposit);
  }

  async getSavings(userId: string): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.getAllSavings(userId);
  }

  async getSavingsById(user: User, id: string): Promise<FixedSavings> {
    return this.fixedSavingsRepository.getSavings(user.id, id);
  }

  getSavingsRecords(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.getCompletedSavings(user.id);
  }
}