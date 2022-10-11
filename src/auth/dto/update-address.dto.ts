import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateAddressDto {
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @ApiProperty()
  street: string;

  @IsNotEmpty()
  @ApiProperty()
  state: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;
}
