import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings/fixed-savings.repository';
import { AuthModule } from '../auth/auth.module';
import { FixedSavingsService } from './fixed-savings/fixed-savings.service';
import { FixedDepositController } from './fixed-deposit/fixedDeposit.Controller';
import { FixedSavingsController } from './fixed-savings/fixedSavingsController';
import { FixedDepositService } from './fixed-deposit/fixed-deposit.service';
import { FixedDepositRepository } from './fixed-deposit/fixed-deposit.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FixedSavingsRepository, FixedDepositRepository]),
    AuthModule
  ],
  controllers: [
    FixedDepositController, FixedSavingsController,
  ],
  providers: [FixedSavingsService, FixedDepositService]
})
export class SavingsModule {}
