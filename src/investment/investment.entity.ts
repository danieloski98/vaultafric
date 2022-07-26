import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Duration } from '../plan/base-plan';
@Entity({ name: 'Investment' })
export class InvestmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  owners: string;

  @Column({ nullable: false })
  duration: Duration;

  @Column({ name: 'HasInsurance', nullable: false })
  insurance: boolean;

  @Column({ nullable: false })
  units: number;

  @Column({ name: 'StartDate', nullable: false })
  start: Date;

  @Column({ name: 'MaturityDate', nullable: false })
  end: Date;

  @Column({ nullable: false, default: 'None' })
  riskLevel: string;

  @Column({ nullable: false })
  sector: string;

  @Column({ nullable: false })
  roi: number;

  @Column({ default: false, nullable: false })
  isActive: boolean;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ type: 'timestamp', select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;
}
