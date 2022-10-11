import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ID')
export class IDEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'varchar' })
  num: string;

  @Column({ default: new Date().toISOString(), type: 'varchar' })
  createdAt: string;
}
