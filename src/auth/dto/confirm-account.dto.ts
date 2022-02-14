import { IsInt } from 'class-validator';

export class ConfirmAccountDto {

  @IsInt({message: `Invalid OTP`})
  otp: number;
  
}