import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'SectorEntity' })
export class SectorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  sector: string;

  @Column({ default: new Date().toISOString() })
  created_at: string;
}
