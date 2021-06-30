import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SavingsOccurrence } from '../../plan/base-plan';

export class UpdatedFixedSavingsDto {
  id: string;

  @IsString()
  name: string;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsNumber()
  amount: number;

  @IsString()
  occurrence: SavingsOccurrence;
}