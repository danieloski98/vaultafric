import { SavingsOccurrence } from '../../../plan/base-plan';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DateTime } from "luxon";

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

  avatar: string;

  @IsNumber()
  amount: number;

  @IsEnum(SavingsOccurrence)
  occurrence: SavingsOccurrence;
}