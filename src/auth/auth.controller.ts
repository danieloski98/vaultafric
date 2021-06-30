import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetCredentialsDto } from './dto/reset-credentails.dto';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { SignInCredentialsDto } from './dto/signin-credentails.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken:string}> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) signUpCredentialsDto: SignUpCredentialsDto) {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('/reset')
  reset(@Body(ValidationPipe) resetAccountDto: ResetCredentialsDto) {
  }

}
