import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class WithdrawDto {

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsUUID()
  id: string;
}