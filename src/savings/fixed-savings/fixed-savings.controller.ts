import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
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

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('fixed-savings')
export class FixedSavingsController {
  constructor(
    private fixedSavingsService: FixedSavingsService) {
  }

  @Get('transactions')
  getFixedSavingsEntries(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getSavings(user);
  }

  @Get('id/:id')
  getFixedSavingsById(@GetUser() user: User, @Param('id', ParseUUIDPipe)id: string): Promise<FixedSavings> {
    return this.fixedSavingsService.getSavingsById(user, id);
  }

  @Get('completed')
  getCompletedFixedSavingsRecords(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getCompletedFixedSavings(user);
  }

  @Get('active')
  getActiveSavings(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getActiveSavings(user);
  }

  @Get('inactive')
  getInactiveSavings(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getInactiveSavings(user);
  }

  @Get('stop/:id')
  stopFixedSavings(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fixedSavingsService.stop(user, id);
  }

  @Post()
  newFixedSavings(@GetUser() user: User, @Body(ParseDatePipe, ValidationPipe) fixedSavingsDto: FixedSavingsDto): Promise<void> {
    return this.fixedSavingsService.createSavings(user, fixedSavingsDto);
  }

  @Delete('/:id')
  deleteFixedSavings(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fixedSavingsService.deleteSavings(user, id);
  }
}