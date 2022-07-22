import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AdminLoginDTO } from '../DTO/LoginDto';
import { AdminRepository } from '../entity/admin-repository';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);
  constructor(private adminRepo: AdminRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      if (authorization === undefined) {
        throw new ForbiddenException({
          statusCode: 403,
          message: 'NOT AUTHORIZED',
        });
      }
      const token = authorization.split(' ')[1];
      // verify token
      const obj: AdminLoginDTO | any = verify(token, process.env.JWT_KEY);
      this.logger.log(obj);
      if (obj.email === undefined) {
        throw new ForbiddenException({
          statusCode: 403,
          message: 'NOT AUTHORIZED, INVALID TOKEN',
        });
      }
      // check if admin exist
      const exists = await this.adminRepo.findOne({
        where: { email: obj.email },
      });

      if (exists === undefined) {
        throw new ForbiddenException({
          message: 'NOT AUTHORIZED',
        });
      }
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
