import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings/fixed-savings.repository';
import { AuthModule } from '../auth/auth.module';
import { FixedSavingsService } from './fixed-savings/fixed-savings.service';
import { FixedDepositController } from './fixed-deposit/fixedDeposit.Controller';
import { FixedSavingsController } from './fixed-savings/fixedSavingsController';
import { AccountRepository } from './repository/account.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FixedSavingsRepository, AccountRepository]),
    AuthModule
  ],
  controllers: [
    AccountController, FixedDepositController, FixedSavingsController
  ],
  providers: [AccountService, FixedSavingsService]
})
export class SavingsModule {}
