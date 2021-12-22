import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'Profile'})
export class ProfileEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({nullable: true})
  otherNames: string;

  @Column({nullable: true})
  country: string;

  @Column({nullable: true})
  state: string;

  @Column({nullable: true})
  street: string;

  @Column({nullable: true})
  city: string;

  @Column({nullable: true})
  avatar: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}