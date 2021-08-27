import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from './repository/account.repository';
import { Account } from './account.entity';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/entity/user.entity';
import { CreditAccountDto } from './dto/credit.account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository
  ) {}

  async getAccountBalance(@GetUser() user: User): Promise<Account> {
    return await this.accountRepository.getAccountBalance(user);
  }

  async creditAccount(user: User, creditAccountDto: CreditAccountDto): Promise<Account> {
    const { amount } = creditAccountDto;
    let account = await this.getAccountBalance(user);

    if(!account) {
      account = this.accountRepository.create({ balance: amount, user })
    } else {
      account.balance += amount;
    }
    await this.accountRepository.save(account)
    return account;
  }
}