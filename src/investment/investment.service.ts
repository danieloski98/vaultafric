import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInvestmentRepository } from './user-investment-repository';
import { NewUserInvestmentDto } from './dto/new-user-investment.dto';
import { User } from '../auth/entity/user.entity';
import { UserInvestmentEntity } from './user-investment.entity';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger('InvestmentService');

  constructor(
    @InjectRepository(UserInvestmentRepository)
    private investmentRepository: UserInvestmentRepository
  ) {}

  async invest(user: User, newUserInvestmentDto: NewUserInvestmentDto) {
    const {} = newUserInvestmentDto;
    const userInvestment = this.investmentRepository.create({});

    try {
      await this.investmentRepository.save(userInvestment);
    }catch(err) {
      this.logger.error(err);
      throw new BadRequestException('Could not complete investment process. Please try again later.')
    }
  }

  async getInvestmentById(id: number): Promise<UserInvestmentEntity> {
    return this.investmentRepository.findOne({
      where: { id }
    });
  }
}