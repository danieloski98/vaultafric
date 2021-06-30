import { Module } from '@nestjs/common';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedSavingsRepository } from './fixed-savings/fixed-savings.repository';
import { AuthModule } from '../auth/auth.module';
import { FixedSavingsService } from './fixed-savings/fixed-savings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FixedSavingsRepository]),
    AuthModule
  ],
  controllers: [SavingsController],
  providers: [SavingsService, FixedSavingsService]
})
export class SavingsModule {}
