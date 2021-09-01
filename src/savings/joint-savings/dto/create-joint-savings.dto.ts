import { SavingsOccurrence } from '../../plan/base-plan';
import { User } from '../../../auth/entity/user.entity';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJointSavingsDto {
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @IsNotEmpty()
  @IsString()
  savingsName: string;

  @IsNotEmpty()
  @IsNumber()
  targetAmount: number;

  @IsNotEmpty()
  @IsDate()
  start: Date;

  @IsNotEmpty()
  @IsDate()
  end: Date;

  @IsNotEmpty()
  @IsEnum(SavingsOccurrence)
  pattern: SavingsOccurrence;

  @IsNotEmpty()
  @IsArray()
  friends: User[];
}