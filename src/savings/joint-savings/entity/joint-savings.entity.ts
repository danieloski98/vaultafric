import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../../auth/entity/user.entity';
import { SavingsOccurrence } from '../../../plan/base-plan';
import { JointSavingsParticipants } from './joint-savings-participants.entity';

@Entity({ name: 'JointSavings' })
@Unique(['groupName', 'savingsName', 'owner'])
export class JointSavings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  groupName: string;

  @Column({ nullable: false })
  savingsName: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false, default: 0 })
  balance: number;

  @Column({ nullable: false })
  start: Date;

  @Column({ nullable: false })
  end: Date;

  @Column({
    // enum: SavingsOccurrence,
    nullable: false,
  })
  pattern: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @OneToMany(() => JointSavingsParticipants, (jsp) => jsp.jointSavings)
  participants: JointSavingsParticipants[];

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User, (user) => user.id, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: User;
}
