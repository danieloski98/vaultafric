import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt-payload.interface';
import { UserRepository } from '../repository/user.repository';
import { SignInCredentialsDto } from '../dto/signin-credentails.dto';
import { SignUpCredentialsDto } from '../dto/signup-credentials.dto';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { NewPasswordDto } from '../dto/new-password.dto';
import { OtpService } from './otp.service';
import { NotificationService } from '../../notification/notification.service';
import { SendOtpDto } from '../dto/send-otp.dto';
import { ProfileService } from './profile.service';
import { DeleteUserAccountDto } from '../dto/delete-user-account.dto';

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

            const otp: string = await this.otpService.getOTP(user);
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

    async confirmCode(confirmAccountDto: ConfirmAccountDto): Promise<{ message: string }> {
        this.logger.log(`Confirm account started...`);

        const otpModel = await this.otpService.getOtpModel(confirmAccountDto.otp);

        if (!otpModel) {
            this.logger.error(`OTP does not exist`);
            throw new BadRequestException(`OTP not found`);
        }

        if(this.otpService.isExpired(otpModel)) {
            this.logger.error(`Expired OTP ${otpModel}`);
            throw new BadRequestException(`OTP has expired`);
        }

        const user = await this.userRepository.findOne({
            where: {id: otpModel.user.id},
            select: ['id', 'isAccountConfirmed']
        });

        if(user.isAccountConfirmed === false) {
            this.logger.log(`Confirming user account...`)

            user.isAccountConfirmed = !user.isAccountConfirmed;
            await this.userRepository.save(user);
        }

        await this.otpService.delete(otpModel);

        this.logger.log(`...confirm account completed; account is confirmed`);
        return { message: "Your account has been confirmed." };
    }

    async createNewPassword(newPasswordDto: NewPasswordDto): Promise<{message: string}> {
        const otpModel = await this.otpService.getOtpModel(newPasswordDto.otp);

        if (!otpModel) {
            throw new BadRequestException(`OTP not found`);
        }

        if(this.otpService.isExpired(otpModel)) {
            throw new BadRequestException(`OTP has expired`);
        }

        await this.userRepository.createPassword(otpModel.user, newPasswordDto);
        await this.otpService.delete(otpModel);

        return {message: "New password saved"};
    }

    async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
        const { email } = sendOtpDto;

        this.logger.log(`Send OTP to user: '${email}'`);

        const user = await this.userRepository.findOne({ email });
        if(!user) {
            throw new NotFoundException(`User not found`);
        }

        try{
            const otp = await this.otpService.getOTP(user);
            await this.sendEmail(user.email, otp);
        }catch (e) {
            this.logger.error(`X Could not generate OTP for ${email}`);
            throw new BadRequestException(`Could not send OTP. Please try again`);
        }

        return {message: "OTP has been sent to your email"};
    }

    private async sendEmail(email: string, otp: string): Promise<void> {
        await this.notificationService.sendOTP(email, otp);
    }

    async deleteAccount(deleteAccountDto: DeleteUserAccountDto) {
        this.logger.log(`Deleting account... ${deleteAccountDto.email}`);
        const {email} = deleteAccountDto;
        const user = await this.userRepository.findOne({ email });

        if(!user) {
            this.logger.error(`Account '${email}' not found.`)
            throw new NotFoundException(`Account not found`);
        }

        await this.userRepository.remove(user);

        this.logger.log(`...delete succeeded`);
        return Promise.resolve({ message: `Account '${email}' has been deleted` });
    }
}
