import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings.repository';
import { User } from '../../auth/entity/user.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { UpdatedFixedSavingsDto } from './dto/updated-fixed-savings.dto';
import { FixedSavings } from './fixed-savings.entity';

@Injectable()
export class FixedSavingsService {

  constructor(
    @InjectRepository(FixedSavingsRepository)
    private fixedSavingsRepository: FixedSavingsRepository
  ) {

    // schedule('* * * * * *', () => {
    //   this.test()
    // });
  }

  test() {
    console.log('Here\'s my running cron job');
  }

  async createSavings(user: User, fixedSavingsDto: FixedSavingsDto): Promise<void> {
    if(fixedSavingsDto.start.getDate() > fixedSavingsDto.end.getDate()) {
      throw new BadRequestException('Update date selection');
    }

    return this.fixedSavingsRepository.newSavings(user, fixedSavingsDto);
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

  async deleteSavings(user: User, id: string): Promise<void> {
    await this.fixedSavingsRepository.delete({user, id})
  }

  async getSavings(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.find({
      where: { user }
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
      where: { user, isActive: true }
    });
  }

  getInactiveSavings(user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsRepository.find({
      where: { user, isActive: false }
    });
  }

  async stop(user: User, id: string): Promise<void> {
    await this.fixedSavingsRepository.save({ id, user, isActive: false })
  }

}