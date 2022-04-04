import { BaseEntity, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JointSavings } from './joint-savings.entity';

@Entity({ name: 'JointSavingsTransaction' })
export class JointSavingsTransaction extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => JointSavings, jointSavings => jointSavings.id, { nullable: false })
  @JoinColumn()
  account: JointSavings;

}