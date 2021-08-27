import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({unique: true})
    username: string

    @Column({unique: true})
    phoneNumber: string

    @Column()
    password: string;

    @Column({ default: false })
    isAccountConfirmed: boolean;
}