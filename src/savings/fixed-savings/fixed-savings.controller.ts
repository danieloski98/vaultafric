import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post, UploadedFile,
  UseGuards, UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from '../../auth/get-user-decorator';
import { User } from '../../auth/entity/user.entity';
import { FixedSavings } from './fixed-savings.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { FixedSavingsService } from './fixed-savings.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { ParseDatePipe } from '../pipe/ParseDate.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { WithdrawDto } from './dto/withdraw.dto';
import { config } from 'dotenv';

config();

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('fixed-savings')
export class FixedSavingsController {

  constructor(
    private fixedSavingsService: FixedSavingsService
  ) {
  }

  @Get('transactions')
  getFixedSavingsEntries(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getSavings(user);
  }

  @Get('completed')
  getCompletedFixedSavingsRecords(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getCompletedFixedSavings(user);
  }

  @Post('withdraw')
  withdrawSavings(@GetUser() user: User, @Body(ValidationPipe) withdrawDto: WithdrawDto): Promise<{ message: string }> {
    return this.fixedSavingsService.withdrawSavings(user, withdrawDto);
  }

  @Get('active')
  getActiveSavings(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getActiveSavings(user);
  }

  @Get('inactive')
  getInactiveSavings(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getInactiveSavings(user);
  }

  @Get('interest/rate')
  getInterestRate() {
    return {rate: +process.env.FIXED_SAVINGS_INTEREST_RATE};
  }

  @Get('stop/:id')
  stopFixedSavings(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.fixedSavingsService.stop(user, id);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  newFixedSavings(@GetUser() user: User,
                  @Body(ParseDatePipe, ParseIntPipe, ValidationPipe) fixedSavingsDto: FixedSavingsDto,
                  @UploadedFile() file: Express.Multer.File): Promise<{ message: string }> {
    return this.fixedSavingsService.createSavings(user, fixedSavingsDto, file?.buffer);
  }

  @Delete(':id')
  deleteFixedSavings(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.fixedSavingsService.deleteSavings(user, id);
  }

  @Get(':id')
  getFixedSavingsById(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<FixedSavings> {
    return this.fixedSavingsService.getSavingsById(user, id);
  }

}