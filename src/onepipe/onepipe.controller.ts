import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entity/user.entity';
import { GetUser } from 'src/auth/get-user-decorator';
import { AccountConfirmedGuard } from 'src/auth/guard/accountConfirmed.guard';
import { OpenAccountDto } from './dto/openAccount.dto';
import { ValidateOtpDto } from './dto/validateOtp.dto';
import { OnePipeService } from './one-pipe.service';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('onepipe')
export class OnePipeController {
  constructor(private onePipeService: OnePipeService) {}

  @Post('open-account')
  async OpenAccount(
    @GetUser() user: User,
    @Body(new ValidationPipe({ transform: true }))
    openAccountDto: OpenAccountDto,
  ) {
    await this.onePipeService.openAccount(
      {
        customer_ref: user.id,
        email: user.email,
        firstname: user.firstname,
        surname: user.lastname,
        mobile_no: user.phoneNumber,
      },
      openAccountDto,
      openAccountDto.bvn,
    );
    return { message: 'check log' };
  }

  @Post('validate-otp')
  async ValidateOtp(
    @GetUser() user: User,
    @Body(new ValidationPipe({ transform: true }))
    validateOtpDto: ValidateOtpDto,
  ) {
    await this.onePipeService.validateOTP(
      {
        customer_ref: user.id,
        email: user.email,
        firstname: user.firstname,
        surname: user.lastname,
        mobile_no: user.phoneNumber,
      },
      validateOtpDto.otp,
    );
    return { message: 'check log' };
  }
}
