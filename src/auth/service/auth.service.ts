import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../jwt-payload.interface';
import { UserRepository } from '../repository/user.repository';
import { SignInCredentialsDto } from '../dto/signin-credentails.dto';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { ResetCredentialsDto } from '../dto/reset-credentails.dto';
import { User } from '../entity/user.entity';
import { NewPasswordDto } from '../dto/new-password.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private otpService: OtpService,
        private jwtService: JwtService
    ) {}

    async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<{ confirmationCode: string }> {
        const { email, username, phoneNumber } = signUpCredentialsDto;
        const user = await this.userRepository.findOne({email, username, phoneNumber});

        if(!user) {
            throw new BadRequestException('Records already exist');
        }

        const newUser = await this.userRepository.createUser(signUpCredentialsDto);
        const confirmationCode: string = await this.otpService.getOTPCode(newUser);

        return { confirmationCode };
    }

    async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string}> {
        const { email, password } = signInCredentialsDto;
        const user = await this.getUserByEmail(email);

        if(user && (await bcrypt.compare(password, user.password))) {
            const payload : JwtPayload = {id: user.id};
            const accessToken: string = this.jwtService.sign(payload);
            return {accessToken};
        } else {
            throw new UnauthorizedException();
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({email})
    }

    // TODO - complete function
    async sendEmailOTP(resetCredentialsDto: ResetCredentialsDto): Promise<{ otp: string }> {
        const user = await this.getUserByEmail(resetCredentialsDto.email);

        if(!user) {
            throw new BadRequestException('Email not found.')
        }

        const otp: string = await this.otpService.getOTPCode(user);

        // TODO: send otp to email via sns

        return { otp } // return for local api client test.
    }

    async confirmCode(confirmAccountDto: ConfirmAccountDto): Promise<void> {
        const { otp } = confirmAccountDto;
        const otpModel = await this.otpService.getOtpModel(otp);
        const { user } = otpModel;

        if(!user) {
            throw new BadRequestException(`OTP has expired.`)
        }

        user.isAccountConfirmed = !user.isAccountConfirmed
        await this.userRepository.save(user);
        await this.otpService.delete(otpModel);
    }

    async createNewPassword(newPasswordDto: NewPasswordDto): Promise<void> {
        const otp = await this.otpService.getOtpModel(newPasswordDto.otp);

        if(!otp) {
            throw new UnauthorizedException();
        }

        await this.userRepository.createPassword(otp.user, newPasswordDto);
        await this.otpService.delete(otp);
    }
}
