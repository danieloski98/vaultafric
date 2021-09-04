import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { DollarSavingsService } from './dollar-savings.service';
import { TransferDollarDto } from './dto/transfer-dollar.dto';
import { User } from '../../auth/entity/user.entity';

@Controller('dollars')
export class DollarSavingsController {
  constructor(private dollarService: DollarSavingsService) {}

  @Get('buy/:amount')
  buyDollars(@Param('amount', ParseIntPipe) amount: number): Promise<void> {
    return this.dollarService.buyDollar(amount);
  }

  @Get('convert/:amount')
  convertDollars(@Param('amount', ParseIntPipe) amount: number): Promise<void> {
    return this.dollarService.convertDollars(amount);
  }

  @HttpCode(HttpStatus.OK)
  @Post('transfer')
  transferDollarToVaulters(@Body(ValidationPipe) transferDollarDto: TransferDollarDto): Promise<void> {
    return this.dollarService.transferDollar(transferDollarDto);
  }

  @Get('find/vaulter/:usernameStub')
  findVaulter(@Param('usernameStub') usernameStub: string): Promise<User> {
    return this.dollarService.findVaulter(usernameStub);
  }



}