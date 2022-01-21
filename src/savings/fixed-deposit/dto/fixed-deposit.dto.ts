import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FixedDepositDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  avatar: string;

}