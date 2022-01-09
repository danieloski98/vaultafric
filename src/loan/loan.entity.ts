import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/entity/user.entity';

@Entity({ name: 'Loan' })
export class LoanEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0.3, nullable: false })
  interest: number;

  @Column({nullable: false})
  start: Date;

  @Column({nullable: false})
  end: Date;

  @Column({nullable: false})
  limit: number;

  @Column({nullable: false, type: 'float'})
  serviceFee: number;

  @Column({ nullable: false })
  amount: number;

  @Column({nullable: false})
  balance: number;

  @ManyToOne(() => User, user => user.id, { nullable: false, eager: false })
  user: User;

}