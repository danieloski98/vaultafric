import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { InvestmentEntity } from './investment.entity';
import { User } from '../auth/entity/user.entity';

@Entity({ name: 'UserInvestment' })
@Unique(['user', 'investment'])
export class UserInvestmentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InvestmentEntity, investment => investment.id)
  investment: InvestmentEntity;

  @Column()
  amount: number;

  @Column()
  unit: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

}