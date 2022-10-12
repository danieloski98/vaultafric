import { ApiProperty } from '@nestjs/swagger';

export class ID_DTO {
  @ApiProperty({
    description: 'Either the BVN or NIN',
  })
  id: string;

  @ApiProperty({
    description: '1 = BVN, 2 = NIN',
  })
  type: number;
}
