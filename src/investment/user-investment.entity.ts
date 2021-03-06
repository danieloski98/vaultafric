import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { InvestmentEntity } from './investment.entity';
import { User } from '../auth/entity/user.entity';
import { PaymentMethodsEnum } from './payment-methods.enum';
import { FixedSavings } from '../savings/fixed-savings/fixed-savings.entity';
import { FixedDeposit } from '../savings/fixed-deposit/fixed-deposit.entity';
import { v4 } from 'uuid';


@Entity({ name: 'UserInvestment' })
@Unique(['user', 'investment'])
export class UserInvestmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InvestmentEntity, (investment) => investment.id)
  investment: InvestmentEntity;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false, default: 0 })
  balance: number;

  @Column()
  interest: number;

  @Column({ nullable: false })
  paymentMethod: PaymentMethodsEnum;

  @Column()
  unit: number;

  @Column({ name: 'SavingsAccountRef' })
  savingsId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
