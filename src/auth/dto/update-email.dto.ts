import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail({}, { message: `Invalid email` })
  @ApiProperty()
  email: string;
}
