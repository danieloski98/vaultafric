import { Module } from '@nestjs/common';
import { InvestmentController } from './investment.controller';
import { InvestmentService } from './investment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInvestmentRepository } from './user-investment-repository';
import { InvestmentRepository } from './investment-repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserInvestmentRepository, InvestmentRepository])],
  controllers: [InvestmentController],
  providers: [InvestmentService]
})
export class InvestmentModule {}
