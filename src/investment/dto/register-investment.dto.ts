import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Duration } from '../../plan/base-plan';

export class RegisterInvestmentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  owners: string;

  @ApiProperty({ type: Date })
  @IsDate()
  end: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  start: Date;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  sector: string;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  insurance: boolean;

  @ApiProperty({ type: Number })
  @IsInt()
  units: number;

  @ApiProperty({ enum: Duration })
  @IsNotEmpty()
  @IsEnum(Duration)
  duration: Duration;

  @ApiProperty({ type: Number })
  @IsInt()
  roi: number;

  @ApiProperty({ type: String })
  @IsOptional()
  avatar: string;
}