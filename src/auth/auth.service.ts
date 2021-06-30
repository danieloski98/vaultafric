import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignInCredentialsDto } from './dto/signin-credentails.dto';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
        return this.userRepository.createUser(signUpCredentialsDto);
    }

    async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string}> {
        const { email, password } = signInCredentialsDto;
        const user = await this.userRepository.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))) {
            const payload : JwtPayload = {id: user.id};
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken};
        } else {
            throw new UnauthorizedException('Invalid login credentials. Please try again.')
        }
    }
}
