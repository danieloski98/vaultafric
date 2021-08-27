import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email', 'phoneNumber'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column()
    username: string

    @Column()
    phoneNumber: string

    @Column()
    password: string;

    @Column({
        default: false
    })
    isAccountConfirmed: boolean;
}