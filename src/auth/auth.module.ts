import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepository } from './repository/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { OtpService } from './service/otp.service';
import { OtpRepository } from './repository/otp.repository';
import { AccountConfirmedGuard } from './guard/accountConfirmed.guard';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'my secret',
      signOptions: {
        expiresIn: 1800
      }
    }),
    TypeOrmModule.forFeature([UserRepository, OtpRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService, AccountConfirmedGuard],
  exports: [JwtStrategy, PassportModule, AccountConfirmedGuard]
})
export class AuthModule {}
