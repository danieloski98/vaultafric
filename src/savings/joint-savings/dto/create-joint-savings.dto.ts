import { SavingsOccurrence } from '../../../plan/base-plan';
import { User } from '../../../auth/entity/user.entity';
import { IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class CreateJointSavingsDto {
  @IsNotEmpty()
  groupName: string;

  @IsNotEmpty()
  savingsName: string;

  @IsInt()
  amount: number;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsEnum(SavingsOccurrence)
  pattern: SavingsOccurrence;

  avatar: string;
  
  participants: User[];
}