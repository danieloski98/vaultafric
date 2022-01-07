import { IsNumber } from 'class-validator';

export class TransactionPinDto {

  @IsNumber()
  pin: number;

}