import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings/fixed-savings.repository';
import { AuthModule } from '../auth/auth.module';
import { FixedSavingsService } from './fixed-savings/fixed-savings.service';
import { FixedDepositController } from './fixed-deposit/fixed-deposit.controller';
import { FixedSavingsController } from './fixed-savings/fixed-savings.controller';
import { FixedDepositService } from './fixed-deposit/fixed-deposit.service';
import { FixedDepositRepository } from './fixed-deposit/fixed-deposit.repository';
import { JointSavingsService } from './joint-savings/joint-savings.service';
import { JointSavingsRepository } from './joint-savings/joint-savings.repository';
import { JointSavingsController } from './joint-savings/joint-savings.controller';
import { UserRepository } from '../auth/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FixedSavingsRepository, FixedDepositRepository, JointSavingsRepository, UserRepository]),
    AuthModule
  ],
  controllers: [
    FixedDepositController, FixedSavingsController, JointSavingsController
  ],
  providers: [FixedSavingsService, FixedDepositService, JointSavingsService]
})
export class SavingsModule {}
