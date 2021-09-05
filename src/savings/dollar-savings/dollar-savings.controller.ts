import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('dollars')
export class DollarSavingsController {
  constructor(private dollarService: DollarSavingsService) {}

  @Get('buy/:amount')
  buyDollars(@GetUser() user: User, @Param('amount', ParseIntPipe) amount: number): Promise<void> {
    return this.dollarService.buyDollar(user, amount);
  }

  @Get('convert/:amount')
  convertDollars(@GetUser() user: User, @Param('amount', ParseIntPipe) amount: number): Promise<void> {
    return this.dollarService.convertDollars(user, amount);
  }

  @HttpCode(HttpStatus.OK)
  @Post('transfer')
  transferDollarToVaulters(@GetUser() user: User, @Body(ValidationPipe) transferDollarDto: TransferDollarDto): Promise<void> {
    return this.dollarService.transferDollar(transferDollarDto);
  }

  @Get('find/vaulter/:usernameStub')
  findVaulter(@Param('usernameStub') usernameStub: string): Promise<User> {
    return this.dollarService.findVaulter(usernameStub);
  }



}