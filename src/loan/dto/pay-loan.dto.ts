import { IsInt } from 'class-validator';
export class PayLoanDto {
  @IsInt()
  amount: number;

  @IsInt()
  pin: number;

  card: string;
}
