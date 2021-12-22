import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { NotificationService } from '../../notification/notification.service';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { ProfileService } from './profile.service';

@Injectable()
export class AuthService {
    constructor(
      @InjectRepository(UserRepository)
      private userRepository: UserRepository,
      private otpService: OtpService,
      private jwtService: JwtService,
      private notificationService: NotificationService,
      private profileService: ProfileService
    ) {
    }

    private readonly logger = new Logger(AuthService.name, true);

    async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<{ message: string }> {
        const { email, phoneNumber } = signUpCredentialsDto;

        let user = await this.userRepository.findOne({
            where: [{ email }, { phoneNumber }]
        });

        if (user) {
            throw new BadRequestException('User record exist');
        }

        try {
            user = await this.userRepository.createUser(signUpCredentialsDto);
            await this.profileService.createProfile(user);

            const otp: string = await this.otpService.getOTPCode(user);
            await this.sendEmail(user.email, otp);
        }catch (error) {
            this.logger.error(`An error occurred: ${error}`);
            throw new BadRequestException('An error occurred. Please try again');
        }

        return {message: `A confirmation code has been sent to ${email}`};
    }

    async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
        this.logger.log(`signIn called`);

        const { email, password } = signInCredentialsDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password']
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { id: user.id };
            const accessToken: string = this.jwtService.sign(payload);

            this.logger.log(`User sign in successful - access token generated`);

            return { accessToken };
        } else {
            this.logger.error(`User sign in is not successful`);
            throw new UnauthorizedException();
        }
    }

    async sendEmailOTP(user: User, resetCredentialsDto: ResetCredentialsDto): Promise<{message: string}> {
        const { email } = resetCredentialsDto;

        if(email !== user.email) {
            throw new BadRequestException(`Invalid email`);
        }

        const otp = await this.otpService.getOTPCode(user);
        await this.sendEmail(user.email, otp);

        return {message: `A confirmation code has been sent to ${email}`};
    }

    async confirmCode(confirmAccountDto: ConfirmAccountDto): Promise<void> {
        const otpModel = await this.otpService.getOtpModel(confirmAccountDto.otp);

        if (!otpModel) {
            throw new BadRequestException(`OTP not found`);
        }

        const isValid = await this.otpService.isValid(otpModel);
        if(isValid === false) {
            await this.otpService.delete(otpModel);
            throw new BadRequestException(`OTP has expired`);
        }

        const user = await this.userRepository.findOne({
            where: {id: otpModel.user.id},
            select: ['id', 'isAccountConfirmed']
        });

        if(user.isAccountConfirmed === false) {
            user.isAccountConfirmed = !user.isAccountConfirmed;
            await this.userRepository.save(user);
            await this.otpService.delete(otpModel);
        }
    }

    async createNewPassword(newPasswordDto: NewPasswordDto): Promise<void> {
        const otpModel = await this.otpService.getOtpModel(newPasswordDto.otp);


        if (!otpModel) {
            throw new UnauthorizedException();
        }

        const isValid = await this.otpService.isValid(otpModel);
        if(isValid === false) {
            throw new BadRequestException(`OTP has expired`)
        }

        await this.userRepository.createPassword(otpModel.user, newPasswordDto);
        await this.otpService.delete(otpModel);
    }

    async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {
        const { email } = resendOtpDto;
        const user = await this.userRepository.findOne({ email });

        if(!user) {
            throw new NotFoundException(`User not found`);
        }

        const otp = await this.otpService.getOTPCode(user);
        await this.sendEmail(user.email, otp);

        return {message: "OTP has been sent to your email"};
    }

    private async sendEmail(email: string, otp: string): Promise<void> {
        await this.notificationService.sendOTP(email, otp);
    }
}
