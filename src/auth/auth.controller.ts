import { Body, Controller, Delete, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentails.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { DeleteUserAccountDto } from './dto/delete-user-account.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('signin')
  signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken:string}> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Post('signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto): Promise<{ message: string }> {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @HttpCode(200)
  @Post('resend/otp')
  resendUserOtp(@Body(ValidationPipe) sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    return this.authService.sendOtp(sendOtpDto);
  }

  @HttpCode(200)
  @Post('confirm/account')
  confirmCode(@Body(ValidationPipe) confirmAccountDto: ConfirmAccountDto): Promise<{ message: string }> {
    return this.authService.confirmCode(confirmAccountDto);
  }

  @HttpCode(200)
  @Post('reset/password')
  reset(@Body(ValidationPipe) sendOtpDto: SendOtpDto) : Promise<{message: string}> {
    return this.authService.sendOtp(sendOtpDto);
  }

  @HttpCode(200)
  @Post('create/password')
  createPassword(@Body(ValidationPipe) newPasswordDto: NewPasswordDto): Promise<{message: string}> {
    return this.authService.createNewPassword(newPasswordDto);
  }

  @HttpCode(200)
  @Delete('delete')
  deleteUserAccount(@Body(ValidationPipe) deleteAccountDto: DeleteUserAccountDto): Promise<{message: string}> {
    return this.authService.deleteAccount(deleteAccountDto);
  }

}
