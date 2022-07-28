import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { SignInCredentialsDto } from '../dto/signin-credentails.dto';
import { NewPasswordDto } from '../dto/new-password.dto';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { SendOtpDto } from '../dto/send-otp.dto';
import { DeleteUserAccountDto } from '../dto/delete-user-account.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('USER_AUTH')
  @HttpCode(200)
  @Post('signin')
  signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto) {
    return this.authService.signIn(signInCredentialsDto);
  }

  @ApiTags('USER_AUTH')
  @ApiBody({ type: SignUpCredentialsDto })
  @Post('signup')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @ApiTags('USER_AUTH')
  @ApiBody({ type: SendOtpDto })
  @HttpCode(200)
  @Post('resend/otp')
  resendUserOtp(@Body(ValidationPipe) sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @ApiTags('USER_AUTH')
  @ApiBody({ type: ConfirmAccountDto })
  @HttpCode(200)
  @Post('confirm/account')
  confirmCode(
    @Body(new ValidationPipe({ transform: true }))
    confirmAccountDto: ConfirmAccountDto,
  ) {
    return this.authService.confirmCode(confirmAccountDto);
  }

  @ApiTags('USER_AUTH')
  @ApiBody({ type: SendOtpDto })
  @HttpCode(200)
  @Post('reset/password')
  reset(@Body(ValidationPipe) sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @ApiTags('USER_AUTH')
  @ApiBody({ type: NewPasswordDto })
  @HttpCode(200)
  @Post('create/password')
  createPassword(@Body(ValidationPipe) newPasswordDto: NewPasswordDto) {
    return this.authService.createNewPassword(newPasswordDto);
  }

  @ApiTags('USER_AUTH')
  @ApiBody({ type: DeleteUserAccountDto })
  @HttpCode(200)
  @Delete('delete')
  deleteUserAccount(
    @Body(ValidationPipe) deleteAccountDto: DeleteUserAccountDto,
  ) {
    return this.authService.deleteAccount(deleteAccountDto);
  }
}
