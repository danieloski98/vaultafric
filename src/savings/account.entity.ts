import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/entity/user.entity';

@Entity()
export class Account extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.id, { eager: true, nullable: false })
  @JoinColumn()
  user: User;

  // balance for wallet
  @Column()
  balance: number;
}