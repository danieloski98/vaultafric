import { User } from '../../auth/entity/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'DollarSavings'})
export class DollarSavingsEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: 0})
  balance: number;

  @OneToOne(() => User, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;
}