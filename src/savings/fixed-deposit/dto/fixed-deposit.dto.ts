import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FixedDepositDto {
  @IsString()
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