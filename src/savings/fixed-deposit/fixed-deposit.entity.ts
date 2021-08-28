import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Duration } from '../plan/base-plan';
import { User } from '../../auth/entity/user.entity';

@Entity()
@Unique(['user', 'name'])
export class FixedDeposit extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0, nullable: false })
  amount: number;

  @Column()
  end: Date;

  @Column()
  name: string;

  @Column({ enum: Duration, length: 8 })
  duration: Duration;

  @Column({ default: new Date() })
  start: Date;

  @ManyToOne(() => User, user => user.id, { eager: false, nullable: false })
  user: User;

}