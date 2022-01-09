import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanRequestDto } from './dto/loan-request.dto';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';
import { LoanEntity } from './loan.entity';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../auth/guard/accountConfirmed.guard';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  getLoan(@GetUser() user: User, @Body(ValidationPipe) loanRequestDto: LoanRequestDto) {
    return this.loanService.loanRequest(user, loanRequestDto);
  }

  @Get('balance')
  getAmountOwed(@GetUser() user: User) {
    return this.loanService.getBalance(user);
  }
  
  @Get()
  getLoanHistory(
    @GetUser() user: User,
    // @Query('take', ParseIntPipe)take: number = 5,
    // @Query('skip', ParseIntPipe) skip: number = 0
  )
    : Promise<LoanEntity[]> {
      return this.loanService.getHistory(user);
  }

}
