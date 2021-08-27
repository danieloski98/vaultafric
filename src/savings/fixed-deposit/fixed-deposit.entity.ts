import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plan, SavingsOccurrence } from '../plan/base-plan';
import { User } from '../../auth/entity/user.entity';

@Entity()
export class FixedDeposit extends BaseEntity implements Plan {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: 0,
    nullable: false
  })
  balance: number;

  @Column()
  end: Date;

  @Column()
  name: string;

  @Column()
  occurrence: SavingsOccurrence;

  @Column()
  start: Date;

  @ManyToOne(() => User, user => user.id, {eager: true, nullable: false})
  user: User;

}