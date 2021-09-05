import { IsEnum, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { Duration } from '../../plan/base-plan';

export class LoanRequestDto {

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsEnum(Duration)
  duration: Duration;
}