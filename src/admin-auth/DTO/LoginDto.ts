import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
