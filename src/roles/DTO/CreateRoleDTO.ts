import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDTO {
  @ApiProperty()
  role: string;
}
