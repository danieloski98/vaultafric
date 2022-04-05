import { IsDefined, IsString } from 'class-validator';

export class ValidateOtpDto {
  @IsString()
  @IsDefined()
  otp: string;
}
