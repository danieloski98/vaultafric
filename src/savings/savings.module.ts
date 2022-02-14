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
import { JointSavingsRepository } from './joint-savings/repository/joint-savings.repository';
import { JointSavingsController } from './joint-savings/joint-savings.controller';
import { UserRepository } from '../auth/repository/user.repository';
import { NotificationService } from '../notification/notification.service';
import { DollarSavingsController } from './dollar-savings/dollar-savings.controller';
import { DollarSavingsService } from './dollar-savings/dollar-savings.service';
import { ProfileRepository } from '../auth/repository/profile.repository';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { DollarSavingsRepository } from './dollar-savings/dollar-savings.repository';
import { JointSavingsParticipantsRepository } from './joint-savings/repository/joint-savings-participants.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FixedSavingsRepository, FixedDepositRepository,
      JointSavingsRepository, UserRepository,
      ProfileRepository, DollarSavingsRepository,
      JointSavingsParticipantsRepository
    ]),
    AuthModule
  ],
  controllers: [
    FixedDepositController, FixedSavingsController,
    JointSavingsController, DollarSavingsController, SavingsController
  ],
  providers: [
    FixedSavingsService, FixedDepositService,
    JointSavingsService, NotificationService,
    DollarSavingsService, SavingsService
  ],
  exports: [
    FixedSavingsService, FixedDepositService, JointSavingsService
  ]
})
export class SavingsModule {}
