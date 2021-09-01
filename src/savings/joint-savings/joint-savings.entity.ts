import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { SavingsOccurrence } from '../plan/base-plan';

@Entity({name: 'JointSavings'})
@Unique(['groupName', 'savingsName', 'owner'])
export class JointSavingsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  groupName: string;

  @Column({nullable: false})
  savingsName: string;

  @Column({nullable: false})
  targetAmount: number;

  @Column({nullable: false, default: 0})
  balance: number;

  @Column({nullable: false})
  start: Date;

  @Column({nullable: false})
  end: Date;

  @Column({
    enum: SavingsOccurrence,
    nullable: false,
  })
  pattern: SavingsOccurrence;

  @ManyToMany(() => User)
  @JoinTable({name: 'JointSavingsParticipants'})
  friends: User[];

  @ManyToOne(() => User, user => user.id, { eager: false, nullable: false })
  owner: User;

}