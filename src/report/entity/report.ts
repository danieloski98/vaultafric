import { User } from 'src/auth/entity/user.entity';
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum REPORT_STATUS {
  PENDING = 1,
  FIXED,
}

@Entity({ name: 'Report' })
export class ReportEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  user_id: string;

  @Column({ nullable: false })
  message: string;

  @Column({ default: REPORT_STATUS.PENDING, enum: REPORT_STATUS })
  status: number;

  @Column({ default: new Date(Date.now()).toISOString(), type: 'date' })
  created_at: string;

  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
