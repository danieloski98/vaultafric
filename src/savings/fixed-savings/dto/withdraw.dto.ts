import { IsNumber, IsUUID } from 'class-validator';

export class WithdrawDto {

  @IsUUID()
  id: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  pin: number;
}