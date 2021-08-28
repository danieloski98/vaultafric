import { Duration } from '../../plan/base-plan';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FixedDepositDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  amount: number;

  @IsNotEmpty()
  @IsEnum(Duration)
  duration: Duration;

}