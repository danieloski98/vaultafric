import { IsEmail } from 'class-validator';

export class UpdateEmailDto {

  @IsEmail()
  @IsEmail()
  email: string;

}