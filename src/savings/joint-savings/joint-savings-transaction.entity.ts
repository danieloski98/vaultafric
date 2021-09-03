import { BaseEntity, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JointSavingsEntity } from './joint-savings.entity';

@Entity({ name: 'JointSavingsTransaction' })
export class JointSavingsTransaction extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => JointSavingsEntity, jointSavings => jointSavings.id, { nullable: false })
  @JoinColumn()
  account: JointSavingsEntity;

}