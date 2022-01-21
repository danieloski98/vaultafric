import { IsEmail } from 'class-validator';

export class UpdateEmailDto {

  @IsEmail({}, {message: `Invalid email`})
  email: string;

}