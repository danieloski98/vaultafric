import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepository } from './repository/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { OtpService } from './service/otp.service';
import { OtpRepository } from './repository/otp.repository';
import { AccountConfirmedGuard } from './guard/accountConfirmed.guard';
import { NotificationService } from '../notification/notification.service';
import { ProfileRepository } from './repository/profile.repository';
import { ProfileService } from './service/profile.service';
import { ProfileController } from './controller/profile.controller';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_KEY!,
      signOptions: {
        expiresIn: process.env.EXPIRES_IN
      }
    }),
    TypeOrmModule.forFeature([UserRepository, OtpRepository, ProfileRepository])
  ],
  controllers: [AuthController, ProfileController],
  providers: [AuthService, JwtStrategy, OtpService, AccountConfirmedGuard, NotificationService, ProfileService],
  exports: [JwtStrategy, PassportModule, AccountConfirmedGuard]
})
export class AuthModule {}
