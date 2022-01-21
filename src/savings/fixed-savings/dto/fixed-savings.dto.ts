import { SavingsOccurrence } from '../../../plan/base-plan';
import { IsDate, IsEnum, IsInt, IsNotEmpty} from 'class-validator';

export class FixedSavingsDto {

  @IsNotEmpty()
  name: string;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  avatar: string;

  @IsInt()
  amount: number;

  @IsEnum(SavingsOccurrence)
  occurrence: SavingsOccurrence;
}