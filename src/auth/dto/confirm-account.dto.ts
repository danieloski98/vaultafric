import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class ConfirmAccountDto {
  @IsString()
  @IsNotEmpty()
  otp: string
  
}