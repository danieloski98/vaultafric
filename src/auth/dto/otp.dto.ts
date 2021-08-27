import { User } from '../entity/user.entity';

export class OtpDto {
  otp: string;
  user?: User;
}