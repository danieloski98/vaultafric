import { ApiProperty } from '@nestjs/swagger';

export class AdminSignUpDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  position: string;
}
