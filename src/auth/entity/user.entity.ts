import { ReportEntity } from 'src/report/entity/report';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 } from 'uuid';


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
}
