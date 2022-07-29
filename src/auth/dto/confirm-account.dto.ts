import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ConfirmAccountDto {
  @IsInt({ message: `Invalid OTP` })
  @ApiProperty()
  otp: number;
}
