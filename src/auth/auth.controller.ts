import { Body, Controller, Get, HttpCode, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { ResetCredentialsDto } from './dto/reset-credentails.dto';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentails.dto';
import { GetUser } from './get-user-decorator';
import { User } from './entity/user.entity';
import { NewPasswordDto } from './dto/new-password.dto';
import { AccountConfirmedGuard } from './guard/accountConfirmed.guard';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('/signin')
  signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken:string}> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @HttpCode(200)
  @Post('/confirm/account')
  confirmCode(@Body(ValidationPipe) confirmAccountDto: ConfirmAccountDto): Promise<void> {
    return this.authService.confirmCode(confirmAccountDto);
  }

  @HttpCode(200)
  @Post('/reset/password')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  reset(@GetUser() user: User, @Body(ValidationPipe) resetAccountDto: ResetCredentialsDto) : Promise<string> {
    return this.authService.sendEmailOTP(resetAccountDto);
  }

  @HttpCode(200)
  @Post('create/password')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  createPassword(@Body(ValidationPipe) newPasswordDto: NewPasswordDto): Promise<void> {
    return this.authService.createNewPassword(newPasswordDto);
  }

}
