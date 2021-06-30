import { IsEmail } from 'class-validator';

export class ResetCredentialsDto {
  @IsEmail()
  email: string;
}