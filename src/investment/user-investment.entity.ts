import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { InvestmentEntity } from './investment.entity';
import { User } from '../auth/entity/user.entity';
import { PaymentMethodsEnum } from './payment-methods.enum';
import { FixedSavings } from '../savings/fixed-savings/fixed-savings.entity';
import { FixedDeposit } from '../savings/fixed-deposit/fixed-deposit.entity';

@Entity({ name: 'UserInvestment' })
@Unique(['user', 'investment'])
export class UserInvestmentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InvestmentEntity, investment => investment.id)
  investment: InvestmentEntity;

  @Column({nullable: false})
  amount: number;

  @Column({nullable: false, default: 0})
  balance: number;

  @Column()
  expected: number;

  @Column({nullable: false})
  paymentMethod: PaymentMethodsEnum;

  @Column()
  unit: number;

  @ManyToOne(() => FixedSavings, fd => fd.id)
  fixedSavings: FixedSavings;

  @ManyToOne(() => FixedDeposit, fd => fd.id)
  fixedDeposit: FixedDeposit;

  @ManyToOne(() => User, user => user.id)
  user: User;

}