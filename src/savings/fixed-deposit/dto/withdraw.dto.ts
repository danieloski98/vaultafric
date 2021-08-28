import { IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawDto {

  @IsNotEmpty()
  @IsNumber({maxDecimalPlaces:0, allowInfinity: false})
  amount: number;
}