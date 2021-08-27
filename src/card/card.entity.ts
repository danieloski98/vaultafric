import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'CardName' })
  name: string;

  @Column({ name: 'CardNumber' })
  number: string;

  @Column({ name: 'ExpiryDate'})
  expiry: Date;

  @Column({ name: 'CVV' })
  cvv: string;

}