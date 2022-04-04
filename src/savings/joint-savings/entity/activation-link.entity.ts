import { User } from '../../../auth/entity/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JointSavings } from './joint-savings.entity';

@Entity({ name: `ActivationLink` })
export class ActivationLink extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => JointSavings, { eager: true, onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  jointSavings: JointSavings

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: false })
  link: string;

  @Column({ nullable: false, type: 'bigint' })
  expires: number;
}