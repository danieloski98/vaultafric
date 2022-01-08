import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class WithdrawDto {

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsUUID()
  id: string;
}