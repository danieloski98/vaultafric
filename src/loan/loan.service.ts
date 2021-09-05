import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from './loan.repository';
import { User } from '../auth/entity/user.entity';
import { LoanEntity } from './loan.entity';
import { LoanRequestDto } from './dto/loan-request.dto';

@Injectable()
export class LoanService {
  private readonly logger = new Logger('JointSavingsController', true);

  constructor(
    @InjectRepository(LoanRepository)
    private loanRepository: LoanRepository
  ) {}

  async getHistory(user: User): Promise<LoanEntity[]> {
    return await this.loanRepository.find({
      where: { user }
    })
  }

  async getLoan(user: User, loanRequestDto: LoanRequestDto): Promise<void> {
    const { duration, amount } = loanRequestDto;
    const loanEntity = this.loanRepository.create({ user, amount, duration });

    try {
      await this.loanRepository.save(loanEntity);
    }catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Cannot process loan.')
    }

  }
}
