import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?!['\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak'
  })
  password: string;
}