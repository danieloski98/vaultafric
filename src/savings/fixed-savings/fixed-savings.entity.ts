import { SavingsOccurrence } from '../../plan/base-plan';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity({name: 'FixedSavings'})
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

  @ManyToOne(() => User, user => user.id, {nullable: false})
  user: User
}