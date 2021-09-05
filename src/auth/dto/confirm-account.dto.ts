import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class ConfirmAccountDto {
  @IsNotEmpty()
  otp: string
  
}