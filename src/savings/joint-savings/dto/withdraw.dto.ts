import { IsInt, IsUUID } from 'class-validator';

export class WithdrawDto {

  @IsUUID()
  groupId: string;

  @IsInt()
  amount: number;
}