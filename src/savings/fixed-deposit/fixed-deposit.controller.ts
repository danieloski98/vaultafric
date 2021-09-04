import {
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Controller} from '@nestjs/common';
import { User } from '../../auth/entity/user.entity';
import { GetUser } from '../../auth/get-user-decorator';
import { FixedDepositDto } from './dto/fixed-deposit.dto';
import { FixedDepositService} from './fixed-deposit.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { FixedDeposit } from './fixed-deposit.entity';
import { WithdrawDto } from './dto/withdraw.dto';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('fixed-deposit')
export class FixedDepositController {
  constructor(private fixedDepositService: FixedDepositService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  addFixedDeposit(@GetUser() user: User, @Body(ValidationPipe) fixedDepositDto: FixedDepositDto): Promise<void> {
    return this.fixedDepositService.deposit(user, fixedDepositDto);
  }

  @Get()
  getDeposits(@GetUser() user: User): Promise<FixedDeposit[]> {
    return this.fixedDepositService.getDeposits(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('withdraw')
  withdrawRequest(@GetUser() user: User, @Body(ValidationPipe)withdrawDto: WithdrawDto): Promise<FixedDeposit|undefined> {
    return this.fixedDepositService.withdraw(user, withdrawDto);
  }

  @Delete(':id')
  deleteDeposit(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fixedDepositService.deleteDeposit(user, id);
  }

}