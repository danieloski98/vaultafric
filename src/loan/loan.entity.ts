import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Duration } from '../plan/base-plan';

@Entity({ name: 'Loan' })
export class LoanEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0.3, nullable: false })
  interest: number;

  @Column({ enum: Duration, length: 8 })
  duration: Duration;

  @Column({ default: 0, nullable: false })
  loanLimit: number;

  @Column({ type: 'int', default: 0.0, nullable: false })
  serviceFee: number;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => User, user => user.id, { nullable: false, eager: false })
  user: User;

}