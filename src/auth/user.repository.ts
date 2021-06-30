import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';

// postgres error codes.
enum pgErrorCodes {
    DuplicateEmailErrorCode = '23505'
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
        const {email, password, firstname, lastname, username, phoneNumber} = signUpCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({ email, password:hashedPassword, firstname, lastname, username, phoneNumber });

        try {
            await this.save(user);
        }catch (e) {
            if(e.code === pgErrorCodes.DuplicateEmailErrorCode) throw new ConflictException('Email already exist');
            throw new InternalServerErrorException();
        }
    }
}