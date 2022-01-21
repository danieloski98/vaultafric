import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Duration } from '../../plan/base-plan';

export class RegisterInvestmentDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  owners: string;

  @IsDate()
  end: Date;

  @IsDate()
  start: Date;

  @IsNotEmpty()
  sector: string;

  @IsNotEmpty()
  insurance: boolean;

  @IsInt()
  units: number;

  @IsNotEmpty()
  @IsEnum(Duration)
  duration: Duration;

  @IsInt()
  roi: number;

  @IsOptional()
  avatar: string;
}