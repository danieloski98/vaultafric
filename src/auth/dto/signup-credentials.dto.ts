import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  // @IsNotEmpty()
  // @IsEmail()
  email: string;

  // @IsNotEmpty()
  firstname: string;

  // @IsNotEmpty()
  lastname: string;

  // @IsNotEmpty()
  phoneNumber: string;

  // @IsNotEmpty()
  // @IsString()
  // @MinLength(8)
  // @MaxLength(32)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?!['\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is weak',
  // })
  password: string;
}
