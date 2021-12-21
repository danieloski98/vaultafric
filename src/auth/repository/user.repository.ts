import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcryptjs'
import { InternalServerErrorException } from '@nestjs/common';
import { User } from "../entity/user.entity";
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { NewPasswordDto } from '../dto/new-password.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(signUpCredentialsDto: SignUpCredentialsDto): Promise<User> {
        const {email, password, firstname, lastname, phoneNumber} = signUpCredentialsDto;

        const hashedPassword = await this.hashPassword(password);
        const user = this.create({ email, password:hashedPassword, firstname, lastname, phoneNumber });

        try {
            await this.save(user);
        }catch (e) {
            throw new InternalServerErrorException();
        }
        return user;
    }

    async createPassword(user: User, newPasswordDto: NewPasswordDto): Promise<void> {
        const { password } = newPasswordDto;

        user.password = await this.hashPassword(password);

        try{
            await this.save(user);
        }catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async hashPassword(userPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(userPassword, salt);
    }

}