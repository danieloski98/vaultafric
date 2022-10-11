import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateContactDto {
  // TODO: Verify using regex
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
}
