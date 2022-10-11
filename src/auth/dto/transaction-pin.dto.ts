import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class TransactionPinDto {
  @IsInt()
  @ApiProperty()
  pin: number;
}
