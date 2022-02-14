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
import { JointSavingsRepository } from '../savings/joint-savings/repository/joint-savings.repository';
import { ProfileService } from '../auth/service/profile.service';
import { UserRepository } from '../auth/repository/user.repository';
import { SavingsModule } from '../savings/savings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInvestmentRepository, InvestmentRepository,
      ProfileRepository, UserRepository
    ]),
    SavingsModule
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService, SavingsService, ProfileService]
})
export class InvestmentModule {}
