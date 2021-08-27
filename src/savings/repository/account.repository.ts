import { EntityRepository, Repository } from 'typeorm';
import { Account } from '../account.entity';
import { User } from '../../auth/entity/user.entity';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {

  async getAccountBalance(user: User): Promise<Account> {
    return await this.findOne({ user });
  }

  async creditAccount() {
  }
}
