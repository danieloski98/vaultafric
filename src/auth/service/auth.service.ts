import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
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
import { OnePipeService } from '../../onepipe/one-pipe.service';
import { isExpired } from '../../common/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private otpService: OtpService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private profileService: ProfileService, // private onePipeService: OnePipeService,
  ) {}

  private readonly logger = new Logger(AuthService.name, true);

  async signUp(signUpCredentialsDto: SignUpCredentialsDto) {
    this.logger.log(`New user signup...`);

    const { email, phoneNumber } = signUpCredentialsDto;

    const userExist = await this.userRepository.recordExist({
      email,
      phoneNumber,
    });

    if (userExist) {
      throw new BadRequestException('User exist');
    }

    const user = await this.userRepository.createUser(signUpCredentialsDto);
    console.log(user);
    await this.profileService.createProfile(user);

    const otp = await this.otpService.getOTP(user);
    // await this.sendEmail(user.email, otp);
    this.logger.log(otp);

    return {
      message: `A confirmation code has been sent to ${email}`,
      user,
    };
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto) {
    this.logger.log(`signIn called`);

    const { email, password } = signInCredentialsDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken: string = this.jwtService.sign({ id: user.id });

      this.logger.log(`User sign in successful - access token generated`);

      return { accessToken };
    } else {
      this.logger.error(`User sign in is not successful`);
      throw new BadRequestException(`Sign in failed`);
    }
  }

  async confirmCode(confirmAccountDto: ConfirmAccountDto) {
    this.logger.log(`Confirm account started...`);

    const otpModel = await this.otpService.getOtpModel(confirmAccountDto.otp);

    if (!otpModel) {
      this.logger.error(`OTP does not exist`);
      throw new BadRequestException(`OTP not found`);
    }

    if (isExpired(otpModel.expiresIn)) {
      this.logger.error(`Expired OTP ${otpModel}`);
      throw new BadRequestException(`OTP has expired`);
    }

    const user = await this.userRepository.findOne({
      where: { id: otpModel.user.id },
      select: [
        'id',
        'email',
        'phoneNumber',
        'firstname',
        'lastname',
        'isAccountConfirmed',
      ],
    });

    if (user.isAccountConfirmed === false) {
      this.logger.log(`Confirming user account...`);

      user.isAccountConfirmed = !user.isAccountConfirmed;
      await this.userRepository.save(user);
    }
    await this.otpService.delete(otpModel);

    // connection to onepipe api
    // await this.onePipeService.openAccount({
    //     email: user.email,
    //     mobile_no: user.phoneNumber,
    //     surname: user.lastname,
    //     firstname: user.firstname,
    //     customer_ref: user.id
    // },{
    //     name_on_account: `${user.firstname} ${user.lastname}`,
    // });

    this.logger.log(`...confirm account completed; account is confirmed`);
    return { message: 'Your account has been confirmed.' };
  }

  async createNewPassword(newPasswordDto: NewPasswordDto) {
    const otpModel = await this.otpService.getOtpModel(newPasswordDto.otp);

    if (!otpModel) {
      throw new BadRequestException(`OTP not found`);
    }

    if (this.otpService.isExpired(otpModel)) {
      throw new BadRequestException(`OTP has expired`);
    }

    await this.userRepository.createPassword(otpModel.user, newPasswordDto);
    await this.otpService.delete(otpModel);

    return { message: 'New password saved' };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { email } = sendOtpDto;

    this.logger.log(`Send OTP to user: '${email}'`);

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`Email not found`);
    }

    let otp: number;
    try {
      otp = await this.otpService.getOTP(user);
      await this.sendEmail(user.email, otp);
    } catch (e) {
      this.logger.error(`X Could not generate OTP for ${email}`);
      throw new BadRequestException(`Could not send OTP. Please try again`);
    }

    return {
      message: `OTP has been sent to your email`,
      otp,
    };
  }

  private async sendEmail(email: string, otp: number) {
    await this.notificationService.sendOTP(email, otp);
  }

  async deleteAccount(deleteAccountDto: DeleteUserAccountDto) {
    this.logger.log(`Deleting account... ${deleteAccountDto.email}`);
    const { email } = deleteAccountDto;
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      this.logger.error(`Account '${email}' not found.`);
      throw new NotFoundException(`Account not found`);
    }

    await this.userRepository.remove(user);

    this.logger.log(`...delete succeeded`);
    return Promise.resolve({ message: `Account '${email}' has been deleted` });
  }
}
