import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SavingsModule } from './savings/savings.module';
import { InvestmentModule } from './investment/investment.module';
import { LoanModule } from './loan/loan.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceModule } from './insurance/insurance.module';
import { NotificationModule } from './notification/notification.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    AuthModule, SavingsModule, 
    InvestmentModule, LoanModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgress',
      database: process.env.DB_NAME || 'money-vault',
      autoLoadEntities: true,
      synchronize: true, // TODO: should not be used in prod.
      // logging: true
    }),
    InsuranceModule,
    NotificationModule,
    CardModule
  ],
})
export class AppModule {}
