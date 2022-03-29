import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { SavingsService } from './savings.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('savings')
export class SavingsController {
  constructor(
    private savingsService: SavingsService
  ) {}

  @Get('latest')
  getLatestTransactions(@GetUser() user: User) {
    return this.savingsService.getLatestTransaction();
  }

  @Get('balance/fixed-deposit')
  getFixedDepositBalance(@GetUser() user: User) {
    return this.savingsService.getFixedDepositBalance(user);
  }

  @Get('balance/fixed-savings')
  getFixedSavingsBalance(@GetUser() user: User) {
      return this.savingsService.getFixedSavingsBalance(user);
  }

  @Get('balance/joint-savings')
  getJointSavingsBalance(@GetUser() user: User) {
    return this.savingsService.getJointSavingsBalance(user);
  }
}