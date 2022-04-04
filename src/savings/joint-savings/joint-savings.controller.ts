import {
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JointSavingsService } from './joint-savings.service';
import { AccountConfirmedGuard } from '../../auth/guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/get-user-decorator';
import { CreateJointSavingsDto } from './dto/create-joint-savings.dto';
import { ParseDatePipe } from '../pipe/ParseDate.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { ParseFriendsArrayPipe } from '../pipe/parse-friends-array-pipe';
import { config } from 'dotenv';
import { User } from '../../auth/entity/user.entity';
import { WithdrawDto } from './dto/withdraw.dto';

config();

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('joint-savings')
export class JointSavingsController {

  constructor(
    private jointSavingsService: JointSavingsService
  ) {}

  @Get('find/:phone')
  async findParticipants(@Param('phone') phone: string) {
    return this.jointSavingsService.findParticipants(phone);
  }

  @Get('interest')
  async getInterestRate() {
    return {interest: +process.env.JOINT_SAVINGS_INTEREST};
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  async createJointSavings(@GetUser() user: User,
                           @Body(ParseDatePipe, ParseIntPipe, ParseFriendsArrayPipe,
                             new ValidationPipe({transform: true})) createJointSavingsDto: CreateJointSavingsDto,
                           @UploadedFile() file: Express.Multer.File) {
    return this.jointSavingsService.createJointSavings(user, createJointSavingsDto, file?.buffer);
  }

  @HttpCode(HttpStatus.OK)
  @Post('withdraw')
  async withdraw(@GetUser() user: User, @Body(ParseIntPipe, new ValidationPipe({transform: true})) withdraw: WithdrawDto) {
    return this.jointSavingsService.withdraw(user, withdraw);
  }

  @Get('join/:groupId/:joinToken')
  async joinJointSavingsGroup(@GetUser() user: User, @Param('groupId') groupId: string,
                              @Param('joinToken') joinToken: string) {
    return this.jointSavingsService.joinGroupSavings(user, groupId, joinToken);
  }

  @Get('group/:groupId')
  async getGroupSavingsDetail(@GetUser() user: User,
                              @Param('groupId', ParseUUIDPipe) groupId: string) {
    return this.jointSavingsService.getGroupDetail(user, groupId);
  }
}