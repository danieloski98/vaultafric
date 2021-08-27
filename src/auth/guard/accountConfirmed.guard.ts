import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entity/user.entity';

@Injectable()
export class AccountConfirmedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user

    if(!user) {
      return false;
    }

    return user.isAccountConfirmed;
  }

}