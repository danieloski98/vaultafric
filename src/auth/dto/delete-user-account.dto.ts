import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class DeleteUserAccountDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
