import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class HealthInsuranceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ default: 'Agent' })
  acquisitionChannel: string;

  @Column({ type: 'varchar' })
  paymentPlan: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'simple-json', nullable: true })
  persons: Person[];

  @Column({
    type: 'varchar',
    default: new Date().toISOString(),
  })
  updated_at: string;

  @Column({
    type: 'varchar',
    default: new Date().toISOString(),
  })
  created_at: string;

  @AfterUpdate()
  update() {
    this.updated_at = new Date().toISOString();
  }
}

export class Person {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  gender: 'Female' | 'Male' | 'others';
}
