import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { Duration } from '../../plan/base-plan';
import { v4 } from 'uuid';


@Entity({name: 'FixedDeposits'})
@Unique('fd-user-name-duration-unique-constraint', ['user', 'name', 'start', 'end'])
export class FixedDeposit extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: 0})
  balance: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  duration: Duration;

  @Column({nullable: false})
  start: Date;

  @Column({nullable: false})
  end: Date;

  @Column({nullable: false})
  name: string;

  // @Column({ enum: Duration, length: 8 })
  // duration: Duration;

  @Column({nullable: true})
  avatar: string;

  @ManyToOne(() => User, user => user.id, { eager: false, nullable: false })
  user: User;

}