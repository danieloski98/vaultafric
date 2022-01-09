import { IsNumber } from 'class-validator';

export class DollarToNairaDto {

  @IsNumber()
  amount: number;

  @IsNumber()
  pin: number;
}