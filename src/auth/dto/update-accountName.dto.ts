import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAccountNameDto {
  @IsNotEmpty()
  @ApiProperty()
  firstname: string;

  @IsOptional()
  @ApiProperty()
  othernames: string;

  @IsNotEmpty()
  @ApiProperty()
  lastname: string;
}
