import { IsNumber } from 'class-validator';

export class ConfirmAccountDto {

  @IsNumber({}, {message: 'Invalid OTP'})
  otp: number;
  
}