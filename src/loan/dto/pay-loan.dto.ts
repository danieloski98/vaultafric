import { IsNumber } from 'class-validator';

export class PayLoanDto {

  @IsNumber()
  amount: number;

  @IsNumber()
  pin: number;

  card: string;

}