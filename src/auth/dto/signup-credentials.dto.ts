import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  email: string;

  // @IsNotEmpty()
  @ApiProperty()
  firstname: string;

  // @IsNotEmpty()
  @ApiProperty()
  lastname: string;

  // @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  // @IsNotEmpty()
  // @IsString()
  // @MinLength(8)
  // @MaxLength(32)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?!['\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is weak',
  // })
  @ApiProperty()
  password: string;
}
