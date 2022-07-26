import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { Unique } from 'typeorm';
import { v4 } from 'uuid';


@Entity({name: 'TransactionBase'})
@Unique('card-unique-constraint', ['name', 'cid', 'expiry'])
export class CardEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'identity', nullable: false, select: false})
  cid: string;

  @Column({name: 'name', nullable: false})
  name: string;

  @Column({name: 'four', nullable: false})
  last: string;

  @Column({name: 'expiry', nullable: false})
  expiry: string;

  @ManyToOne(() => User, user => user.id, { nullable:false, onDelete: 'CASCADE', eager: false })
  user: User;
}