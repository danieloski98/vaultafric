import { IsInt } from 'class-validator';

export class TransactionPinDto {

  @IsInt()
  pin: number;

}