import { SavingsOccurrence } from '../../plan/base-plan';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { v4 } from 'uuid';

@Entity({ name: 'FixedSavings' })
@Unique('fs-user-name-occurrence-unique-constraint', [
  'user',
  'name',
  'occurrence',
])
export class FixedSavings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  end: Date;

  @Column()
  start: Date;

  @Column({ default: 0, nullable: false })
  balance: number;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isElapsed: boolean;

  @Column()
  occurrence: SavingsOccurrence;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;
}
