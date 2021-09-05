import { SavingsOccurrence } from '../../../plan/base-plan';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FixedSavingsDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @IsDate()
  end: Date;

  @IsNumber({
    allowNaN: false,
    maxDecimalPlaces: 0
  })
  amount: number;

  occurrence: SavingsOccurrence;
}