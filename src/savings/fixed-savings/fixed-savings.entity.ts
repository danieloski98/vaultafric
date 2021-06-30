import { Plan, SavingsOccurrence } from '../plan/base-plan';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/user.entity';

@Entity()
export class FixedSavings extends BaseEntity implements Plan {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  end: Date;

  @Column()
  start: Date;

  @Column({
    default: 0,
    nullable: false
  })
  balance: number;

  @Column({
    type: 'int',
    nullable: false
  })
  amount: number;

  @Column({
    default: true
  })
  isActive: boolean;

  @Column({
    default: false
  })
  isElapsed: boolean;

  @Column()
  occurrence: SavingsOccurrence;

  @ManyToOne(() => User, user => user.id, {eager: true, nullable: false})
  user: User
}