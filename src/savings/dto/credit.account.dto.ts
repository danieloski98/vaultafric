import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreditAccountDto {

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}