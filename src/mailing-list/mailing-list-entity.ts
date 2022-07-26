import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MailingList' })
export class MailingList extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: new Date().toISOString(),
  })
  createdAt: string;
}
