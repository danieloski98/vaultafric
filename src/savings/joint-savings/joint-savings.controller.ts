import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JointSavingsService } from './joint-savings.service';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user-decorator';
import { CreateJointSavingsDto } from './dto/create-joint-savings.dto';
import { ParseDatePipe } from '../pipe/ParseDate.pipe';
import { User } from '../../auth/entity/user.entity';
import { JointSavingsEntity } from './joint-savings.entity';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('joint-savings')
export class JointSavingsController {

  constructor(private jointSavingsService: JointSavingsService) {}

  @Get('participants/:username')
  async findParticipants(@Param('username') username: string): Promise<User[]> {
    return this.jointSavingsService.findParticipants(username);
  }

  @Post()
  async createJointSavings(@GetUser() user, @Body(ParseDatePipe, ValidationPipe) createJointSavingsDto: CreateJointSavingsDto): Promise<JointSavingsEntity> {
    return this.jointSavingsService.createJointSavings(user, createJointSavingsDto);
  }

  @Get('withdraw')
  async withdraw(): Promise<void> {
    return this.jointSavingsService.withdraw();
  }
}