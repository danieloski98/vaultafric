import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SavingsModule } from './savings/savings.module';
import { InvestmentModule } from './investment/investment.module';
import { LoanModule } from './loan/loan.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceModule } from './insurance/insurance.module';
import { NotificationModule } from './notification/notification.module';
import { CardModule } from './card/card.module';
import { OnepipeModule } from './onepipe/onepipe.module';
import { MailingListModule } from './mailing-list/mailing-list.module';

@Module({
  imports: [
    AuthModule,
    SavingsModule,
    InvestmentModule,
    LoanModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgress',
      database: process.env.DB_NAME || 'money-vault',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development' ? true : false, // TODO: should not be used in prod.
    }),
    InsuranceModule,
    NotificationModule,
    CardModule,
    OnepipeModule,
    MailingListModule,
  ],
})
export class AppModule {}
