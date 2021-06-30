import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FixedSavingsDto } from './fixed-savings/dto/fixed-savings.dto';
import { SavingsService } from './savings.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';
import { FixedSavings } from './fixed-savings/fixed-savings.entity';
import { UpdatedFixedSavingsDto } from './fixed-savings/dto/updated-fixed-savings.dto';
import { DeleteFixedSavingsDto } from './fixed-savings/dto/delete-fixed-savings.dto';
import { FixedSavingsService } from './fixed-savings/fixed-savings.service';

@Controller('savings')
@UseGuards(AuthGuard())
export class SavingsController {

  constructor(
    private fixedSavingsService: FixedSavingsService
  ) {}
  
  @Get('/fixed-savings')
  getFixedSavingsEntries(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getSavings(user.id);
  }

  @Get('/fixed-savings/:id')
  getFixedSavingsById(@GetUser() user: User, @Param('id')id: string): Promise<FixedSavings> {
    return this.fixedSavingsService.getSavingsById(user, id);
  }

  @Get('/fixed-savings/completed')
  getCompletedFixedSavingsRecords(@GetUser() user: User): Promise<FixedSavings[]> {
    return this.fixedSavingsService.getSavingsRecords(user);
  }

  @Post('/fixed-savings')
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
