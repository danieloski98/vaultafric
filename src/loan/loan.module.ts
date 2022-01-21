import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRepository } from './loan.repository';
import { ProfileRepository } from '../auth/repository/profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LoanRepository, ProfileRepository])],
  providers: [LoanService],
  controllers: [LoanController]
})
export class LoanModule {}
