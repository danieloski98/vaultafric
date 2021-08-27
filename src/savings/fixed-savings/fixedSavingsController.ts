import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/get-user-decorator';
import { User } from '../../auth/entity/user.entity';
import { FixedSavings } from './fixed-savings.entity';
import { FixedSavingsDto } from './dto/fixed-savings.dto';
import { UpdatedFixedSavingsDto } from './dto/updated-fixed-savings.dto';
import { DeleteFixedSavingsDto } from './dto/delete-fixed-savings.dto';
import { FixedSavingsService } from './fixed-savings.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('fixed-savings')
export class FixedSavingsController {
  constructor(
    private fixedSavingsService: FixedSavingsService) {
  }

  @Get('/')
  getFixedSavingsEntries(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getSavings(user);
  }

  @Get('/:id')
  getFixedSavingsById(@GetUser() user: User, @Param('id')id: string): Promise<FixedSavings> {
    return this.fixedSavingsService.getSavingsById(user, id);
  }

  @Get('/completed')
  getCompletedFixedSavingsRecords(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getSavingsRecords(user);
  }

  @Post('/')
  newFixedSavings(@GetUser() user: User, @Body() fixedSavingsDto: FixedSavingsDto): Promise<void> {
    return this.fixedSavingsService.createSavings(user, fixedSavingsDto);
  }

  @Patch('/fixed-savings')
  updateFixedSavings(@GetUser() user:User, @Body() fixedSavingsDto: UpdatedFixedSavingsDto): Promise<void> {
    return this.fixedSavingsService.updateSavings(fixedSavingsDto);
  }

  @Delete('/fixed-savings')
  deleteFixedSavings(@GetUser() user: User, @Body() deleteDto: DeleteFixedSavingsDto): Promise<void> {
    return this.fixedSavingsService.deleteSavings(deleteDto.id);
  }
}