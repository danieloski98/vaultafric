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

}