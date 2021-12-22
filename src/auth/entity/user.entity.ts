import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'Users'})
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
    phoneNumber: string

    @Column({select: false})
    password: string;

    @Column({ default: false, select: false })
    isAccountConfirmed: boolean;
}