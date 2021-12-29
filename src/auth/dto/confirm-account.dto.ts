import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAccountDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
  
}