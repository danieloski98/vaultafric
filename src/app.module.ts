import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SavingsModule } from './savings/savings.module';
import { InvestmentModule } from './investment/investment.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [AuthModule, SavingsModule, InvestmentModule, LoanModule],
})
export class AppModule {}
