import { Module } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInvestmentRepository } from './user-investment-repository';
import { InvestmentRepository } from './investment-repository';
import { ProfileRepository } from '../auth/repository/profile.repository';
import { SavingsService } from '../savings/savings.service';
import { FixedSavingsRepository } from '../savings/fixed-savings/fixed-savings.repository';
import { FixedDepositRepository } from '../savings/fixed-deposit/fixed-deposit.repository';
import { JointSavingsRepository } from '../savings/joint-savings/joint-savings.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInvestmentRepository, InvestmentRepository,
      ProfileRepository, FixedDepositRepository, FixedSavingsRepository, JointSavingsRepository
    ]),
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService, SavingsService]
})
export class InvestmentModule {}
