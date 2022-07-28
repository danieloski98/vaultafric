import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from '../../auth/get-user-decorator';
import { User } from '../../auth/entity/user.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { FixedSavingsService } from './fixed-savings.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { ParseDatePipe } from '../pipe/ParseDate.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { WithdrawDto } from './dto/withdraw.dto';
import { config } from 'dotenv';
import { ApiTags } from '@nestjs/swagger';

config();

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('fixed-savings')
export class FixedSavingsController {
  constructor(private fixedSavingsService: FixedSavingsService) {}

  @ApiTags('FIXED-SAVING')
  @Get('transactions')
  getFixedSavingsEntries(@GetUser() user: User) {
    return this.fixedSavingsService.getSavings(user);
  }

  @ApiTags('FIXED-SAVING')
  @Get('completed')
  getCompletedFixedSavingsRecords(@GetUser() user: User) {
    return this.fixedSavingsService.getCompletedFixedSavings(user);
  }

  @ApiTags('FIXED-SAVING')
  @Post('withdraw')
  withdrawSavings(
    @GetUser() user: User,
    @Body(ValidationPipe) withdrawDto: WithdrawDto,
  ) {
    return this.fixedSavingsService.withdrawSavings(user, withdrawDto);
  }

  @ApiTags('FIXED-SAVING')
  @Get('active')
  getActiveSavings(@GetUser() user: User) {
    return this.fixedSavingsService.getActiveSavings(user);
  }

  @ApiTags('FIXED-SAVING')
  @Get('inactive')
  getInactiveSavings(@GetUser() user: User) {
    return this.fixedSavingsService.getInactiveSavings(user);
  }

  @ApiTags('FIXED-SAVING')
  @Get('interest/rate')
  getInterestRate() {
    return { rate: +process.env.FIXED_SAVINGS_INTEREST_RATE };
  }

  @ApiTags('FIXED-SAVING')
  @Get('stop/:id')
  stopFixedSavings(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fixedSavingsService.stop(user, id);
  }

  @ApiTags('FIXED-SAVING')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  newFixedSavings(
    @GetUser() user: User,
    @Body(ParseDatePipe, ParseIntPipe, ValidationPipe)
    fixedSavingsDto: FixedSavingsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fixedSavingsService.createSavings(
      user,
      fixedSavingsDto,
      file?.buffer,
    );
  }

  @ApiTags('FIXED-SAVING')
  @Delete(':id')
  deleteFixedSavings(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fixedSavingsService.deleteSavings(user, id);
  }

  @ApiTags('FIXED-SAVING')
  @Get(':id')
  getFixedSavingsById(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fixedSavingsService.getSavingsById(user, id);
  }
}
