import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DollarSavingsService } from './dollar-savings.service';
import { TransferDollarDto } from './dto/transfer-dollar.dto';
import { User } from '../../auth/entity/user.entity';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { DollarOpsDto } from './dto/dollar-ops.dto';
import { config } from 'dotenv';
import { DollarToNairaDto } from './dto/dollar-to-naira.dto';
import { ApiTags } from '@nestjs/swagger';

config();

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('dollars')
export class DollarSavingsController {
  constructor(private dollarService: DollarSavingsService) {}

  @ApiTags('DOLLAR-SAVING')
  @Get('balance')
  getBalance(@GetUser() user: User) {
    return this.dollarService.getBalance(user);
  }

  @ApiTags('DOLLAR-SAVING')
  @Get('conversion/charge')
  getDollarConversionCharge() {
    return { charge: +process.env.DOLLAR_CONVERSION_CHARGE };
  }

  @ApiTags('DOLLAR-SAVING')
  @HttpCode(HttpStatus.OK)
  @Post('buy')
  buyDollars(
    @GetUser() user: User,
    @Body(ParseIntPipe, ValidationPipe) dollarOpsDto: DollarOpsDto,
  ) {
    return this.dollarService.buyDollar(user, dollarOpsDto);
  }

  @ApiTags('DOLLAR-SAVING')
  @HttpCode(HttpStatus.OK)
  @Post('convert')
  convertDollars(
    @GetUser() user: User,
    @Body(ParseIntPipe, ValidationPipe) dollarToNairaDto: DollarToNairaDto,
  ) {
    return this.dollarService.convertDollars(user, dollarToNairaDto);
  }

  @ApiTags('DOLLAR-SAVING')
  @Get('rate/dollar-naira')
  getDollarToNairaRate() {
    return { rate: +process.env.DOLLAR_TO_NAIRA_RATE };
  }

  @ApiTags('DOLLAR-SAVING')
  @Get('rate/naira-dollar')
  getNairaToDollarRate() {
    return { rate: +process.env.NAIRA_TO_DOLLAR_RATE };
  }

  @ApiTags('DOLLAR-SAVING')
  @HttpCode(HttpStatus.OK)
  @Post('transfer')
  transferDollarToVaulters(
    @GetUser() user: User,
    @Body(ValidationPipe) transferDollarDto: TransferDollarDto,
  ) {
    return this.dollarService.transferDollar(transferDollarDto);
  }

  @ApiTags('DOLLAR-SAVING')
  @Get('find/:phone')
  findVaulter(@Param('phone') phone: string) {
    return this.dollarService.findVaulter(phone);
  }
}
