import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Duration } from '../../plan/base-plan';
import { User } from '../../auth/entity/user.entity';

@Entity({name: 'FixedDeposits'})
@Unique('fd-user-name-duration-unique-constraint', ['user', 'name', 'duration'])
export class FixedDeposit extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: 0})
  balance: number;

  @Column({ nullable: false })
  amount: number;

  @Column({nullable: false})
  start: Date;

  @Column({nullable: false})
  end: Date;

  @Column({nullable: false})
  name: string;

  @Column({ enum: Duration, length: 8 })
  duration: Duration;

  @Column({nullable: true})
  avatar: string;

  @ManyToOne(() => User, user => user.id, { eager: false, nullable: false })
  user: User;

}