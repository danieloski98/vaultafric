import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entity/user.entity';

@Injectable()
export class AccountConfirmedGuard implements CanActivate {
  private readonly logger = new Logger(AccountConfirmedGuard.name, true);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log(`canActivate guard called`);

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if(!user || !user.isAccountConfirmed) {
      this.logger.error(`User account has not been confirmed`)
      throw new UnauthorizedException('Your account has not been confirmed');
    }

    this.logger.log(`User account has been confirmed`);

    return user.isAccountConfirmed;
  }

}