import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { JointSavingsEntity } from './joint-savings.entity';

@Entity({name: 'JointSavingsParticipants'})
export class JointSavingsParticipantsEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JointSavingsEntity, js => js.id, { nullable: false } )
  jointSavings: JointSavingsEntity;

  @Column({nullable: false, default: false})
  hasJoinedGroup: boolean;

  @Column({nullable: false, select: false, unique: true})
  token: string;

  @Column({nullable: true})
  joinDate: Date;

  @CreateDateColumn({select: false})
  createdOn: Date

  @UpdateDateColumn({select: false})
  updatedOn: Date

  @ManyToOne(() => User, user => user.id, {nullable: false, eager: true})
  user: User;

}