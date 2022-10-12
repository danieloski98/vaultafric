import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('GovernmentIDEntity')
export class GovernmentIDEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  front: string;

  @Column({ type: 'varchar' })
  back: string;

  @Column({ default: new Date().toISOString(), type: 'varchar' })
  createdAt: string;
}
