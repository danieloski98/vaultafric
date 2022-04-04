import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../auth/entity/user.entity';
import { JointSavings } from './joint-savings.entity';

@Entity({name: 'JointSavingsParticipants'})
export class JointSavingsParticipants extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JointSavings, js => js.id, { nullable: false } )
  jointSavings: JointSavings;

  @Column({nullable: false, default: false})
  hasJoinedGroup: boolean;

  @CreateDateColumn({select: false})
  createdOn: Date

  @UpdateDateColumn({select: false})
  updatedOn: Date

  @ManyToOne(() => User, user => user.id, {nullable: false, eager: true})
  user: User;

}