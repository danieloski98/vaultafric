import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class ConfirmAccountDto {
  @IsNotEmpty()
  @Length(6, 6)
  otp: string
  
}