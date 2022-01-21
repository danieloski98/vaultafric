import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'OneTimePasswords' })
@Unique(['otp', 'user'])
export class Otp extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;

  @Column({nullable: false})
  otp: number;

  @Column({nullable: false, type: 'bigint'})
  expiresIn: number;
}