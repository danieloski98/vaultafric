import { IsInt, IsNotEmpty } from 'class-validator';

export class DollarOpsDto {

  @IsInt()
  amount: number;

  @IsNotEmpty()
  cardId: string;
}