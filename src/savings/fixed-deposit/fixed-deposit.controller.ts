import {
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Controller } from '@nestjs/common';
import { User } from '../../auth/entity/user.entity';
import { GetUser } from '../../auth/get-user-decorator';
import { FixedDepositDto } from './dto/fixed-deposit.dto';
import { FixedDepositService } from './fixed-deposit.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { FixedDeposit } from './fixed-deposit.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { ParseDatePipe } from '../pipe/ParseDate.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { config } from 'dotenv';
import { ApiTags } from '@nestjs/swagger';

config();

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('fixed-deposit')
export class FixedDepositController {
  constructor(private fixedDepositService: FixedDepositService) {}

  @ApiTags('FIXED-DEPOSIT')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  addFixedDeposit(
    @GetUser() user: User,
    @Body(ParseIntPipe, ParseDatePipe, new ValidationPipe({ transform: true }))
    fixedDepositDto: FixedDepositDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fixedDepositService.deposit(
      user,
      fixedDepositDto,
      file?.buffer,
    );
  }

  @ApiTags('FIXED-DEPOSIT')
  @Get()
  getDeposits(@GetUser() user: User): Promise<FixedDeposit[]> {
    return this.fixedDepositService.getDeposits(user);
  }

  @ApiTags('FIXED-DEPOSIT')
  @HttpCode(HttpStatus.OK)
  @Post('withdraw')
  withdrawRequest(
    @GetUser() user: User,
    @Body(ValidationPipe) withdrawDto: WithdrawDto,
  ) {
    return this.fixedDepositService.withdraw(user, withdrawDto);
  }

  @ApiTags('FIXED-DEPOSIT')
  @Get('interest/rate')
  getInterestRate() {
    return { rate: +process.env.FIXED_DEPOSIT_INTEREST_RATE };
  }

  @ApiTags('FIXED-DEPOSIT')
  @Delete(':id')
  deleteDeposit(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.fixedDepositService.deleteDeposit(user, id);
  }
}
