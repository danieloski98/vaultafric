import { Body, Controller, Get, HttpCode, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { User } from '../auth/entity/user.entity';
import { GetUser } from '../auth/get-user-decorator';
import { CreditAccountDto } from './dto/credit.account.dto';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('savings')
export class AccountController {

  constructor(
    private accountService: AccountService
  ) {}

  @Get('wallet')
  getAccountDetails(@GetUser() user: User): Promise<Account> {
    return this.accountService.getAccountBalance(user);
  }

  @HttpCode(200)
  @Post('wallet')
  creditAccount(@GetUser() user: User, @Body(ValidationPipe) creditAccountDto: CreditAccountDto): Promise<Account> {
    return this.accountService.creditAccount(user, creditAccountDto);
  }
  

}
