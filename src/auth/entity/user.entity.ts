import { UserInvestmentEntity } from 'src/investment/entity/user-investment.entity';
import { LoanEntity } from 'src/loan/loan.entity';
import { ReportEntity } from 'src/report/entity/report';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 } from 'uuid';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false, select: false })
  isAccountConfirmed: boolean;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];

  // @JoinColumn()
  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @OneToMany(() => UserInvestmentEntity, (invest) => invest.user)
  investments: UserInvestmentEntity[];

  @OneToMany(() => LoanEntity, (loan) => loan.user)
  loans: LoanEntity[];
}
