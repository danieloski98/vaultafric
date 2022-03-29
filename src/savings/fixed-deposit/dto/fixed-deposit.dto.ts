import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Duration } from '../../../plan/base-plan';

export class FixedDepositDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsEnum(Duration)
  duration: Duration;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  avatar: string;

}