import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { SavingsOccurrence } from '../../plan/base-plan';
import { JointSavingsParticipantsEntity } from './joint-savings-participants.entity';

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
  amount: number;

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

  @Column({nullable: false, default: true})
  isActive: boolean;

  @OneToMany(() => JointSavingsParticipantsEntity, jsp => jsp.jointSavings)
  participants: JointSavingsParticipantsEntity[];

  // @ManyToMany(() => User, { onDelete: 'CASCADE' })
  // @JoinTable({name: 'JointSavingsParticipants'})
  // participants: User[];

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User, user => user.id, { eager: false, nullable: false, onDelete: 'CASCADE' })
  owner: User;

}