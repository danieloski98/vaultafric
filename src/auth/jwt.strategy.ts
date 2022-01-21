import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './entity/user.entity';
import {config} from 'dotenv';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  private readonly logger = new Logger(JwtStrategy.name, true);

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      secretOrKey: process.env.JWT_KEY!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

    async validate(payload: JwtPayload): Promise<User> {
      this.logger.log(`Validate jwt token`);
      const { id } = payload;
      const user: User = await this.userRepository.findOne({
        where: {id},
        select: ['id', 'isAccountConfirmed']
      });

      if(!user){
        this.logger.error(`Could not validate JWT token`)
        throw new UnauthorizedException(`Error in logging in`);
      }

      this.logger.log(`JWT validated`);

      return user;
  }
}