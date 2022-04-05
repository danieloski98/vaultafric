import { Injectable, Logger} from '@nestjs/common';
import { TransferDollarDto } from './dto/transfer-dollar.dto';
import { User } from '../../auth/entity/user.entity';
import { UserRepository } from '../../auth/repository/user.repository';
import { DollarOpsDto } from './dto/dollar-ops.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DollarSavingsRepository } from './dollar-savings.repository';
import { ProfileRepository } from '../../auth/repository/profile.repository';
import { DollarToNairaDto } from './dto/dollar-to-naira.dto';
import { InvalidDepositAmountException } from '../../exception/invalid-deposit-amount.exception';
import { TransactionPinMismatchException } from '../../exception/transaction-pin-mismatch.exception';
import { InvalidConversionAmountException } from '../../exception/invalid-conversion-amount.exception';
import { InsufficientBalanceException } from '../../exception/insufficient-balance.exception';
import { ProfileService } from '../../auth/service/profile.service';

@Injectable()
export class DollarSavingsService {
  private readonly logger = new Logger('DollarSavingsService', true);

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(DollarSavingsRepository)
    private dollarRepository: DollarSavingsRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,

    private profileService: ProfileService
    ) {}

  async buyDollar(user:User, dollarOpsDto: DollarOpsDto) {
    const {amount, cardId } = dollarOpsDto;
    this.logger.log(`Buy dollar called - N${amount}`);

    if(amount == 0) {
      throw new InvalidDepositAmountException();
    }

    // TODO: funds to be withdrawn from users account using card id.
    //TODO: convert using 3rd party

    let account = await this.dollarRepository.findOne({where: {user}});
    if(!account) {
      account = this.dollarRepository.create({user, balance: amount})
    } else {
      account.balance += amount;
    }

    await this.dollarRepository.save(account);

    return {message: `Account credited with $${amount} dollars`};
  }

  async convertDollars(user: User, dollarToNairaDto: DollarToNairaDto) {
    this.logger.log(`Convert naira to dollars`);
    const {amount, pin} = dollarToNairaDto;

    if(amount === 0) {
      throw new InvalidConversionAmountException();
    }

    this.logger.log(`Get transaction pin`)
    const { transactionPin } = await this.profileService.getPin(user);

    if(transactionPin !== pin){
      this.logger.error(`Invalid transaction pin`);
      throw new TransactionPinMismatchException();
    }

    this.logger.log(`Fetch user dollar account...`);
    const dollarAccount = await this.dollarRepository.findOne({
      where: {user},
      select: ['id', 'balance']
    });

    if(dollarAccount.balance < amount) {
      this.logger.error(`Insufficient funds in dollar account`);
      throw new InsufficientBalanceException();
    }

    // TODO: sync with 3rd party onepipe tool
    dollarAccount.balance -= amount;

    // TODO: Credit enter bank detail

    await this.dollarRepository.save(dollarAccount);

    return {message: `Your bank account has been credited`};
  }

  async transferDollar(transferDollarDto: TransferDollarDto) {
    this.logger.log(`Transfer dollar to vaulter - '${transferDollarDto.vaulter.firstname}'`);
    return Promise.resolve(undefined);
  }

  async findVaulter(phone: string) {
    this.logger.log(`find participants with phone number`);
    return await this.profileService.findConfirmedVaultersByPhone(phone);
  }

  async getBalance(user: User) {
    this.logger.log(`Retrieve dollar balance...`);

    const savings = await this.dollarRepository.findOne({
      where: {user},
      select: ['balance']
    });

    if(!savings) {
      this.logger.error(`Dollar savings account not found`);
      return { balance: 0 };
    }

    this.logger.log(`Dollar balance sent.`)
    return {balance: savings.balance};
  }
}