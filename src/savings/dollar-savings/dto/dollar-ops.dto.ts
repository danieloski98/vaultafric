import { IsNumber } from 'class-validator';

export class DollarOpsDto {

  @IsNumber()
  amount: number;
}