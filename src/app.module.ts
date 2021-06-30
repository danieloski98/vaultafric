import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SavingsModule } from './savings/savings.module';
import { InvestmentModule } from './investment/investment.module';
import { LoanModule } from './loan/loan.module';
import { UserprofileModule } from './userprofile/userprofile.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule, SavingsModule, 
    InvestmentModule, LoanModule, UserprofileModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 8000,
      username: 'postgres',
      password: 'postgres',
      database: 'money-vault',
      autoLoadEntities: true,
      synchronize: true
    })
  ],
})
export class AppModule {}
