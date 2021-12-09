import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Duration } from '../plan/base-plan';

@Entity({ name: 'Investment' })
export class InvestmentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  owners: string;

  @Column({ enum: Duration, nullable: false })
  duration: Duration;

  @Column({ name: 'HasInsurance', nullable: false })
  insurance: boolean;

  @Column({ nullable: false })
  units: number;

  @Column({ name: 'StartDate', nullable: false })
  start: Date;

  @Column({ name: 'MaturityDate', nullable: false })
  maturity: Date;

  @Column({ nullable: false })
  riskLevel: string;

  @Column({ nullable: false })
  sector: string;

  @Column({ nullable: false })
  roi: number;

  @Column({ default: false, nullable: false })
  isActive: boolean;

}