import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TransferDollarDto } from './dto/transfer-dollar.dto';
import { User } from '../../auth/entity/user.entity';
import { UserRepository } from '../../auth/repository/user.repository';
import { Like } from 'typeorm';
import { DollarOpsDto } from './dto/dollar-ops.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DollarSavingsRepository } from './dollar-savings.repository';
import { ProfileRepository } from '../../auth/repository/profile.repository';
import { DollarToNairaDto } from './dto/dollar-to-naira.dto';
import { InvalidDepositAmountException } from '../../exception/invalid-deposit-amount.exception';
import { TransactionPinNotFoundException } from '../../exception/transaction-pin-not-found.exception';
import { TransactionPinMismatchException } from '../../exception/transaction-pin-mismatch.exception';
import { InvalidConversionAmountException } from '../../exception/invalid-conversion-amount.exception';
import { InsufficientBalanceException } from '../../exception/insufficient-balance.exception';

@Injectable()
export class DollarSavingsService {
  private readonly logger = new Logger('DollarSavingsService', true);

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(DollarSavingsRepository)
    private dollarRepository: DollarSavingsRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository
    ) {}

  async buyDollar(user:User, dollarOpsDto: DollarOpsDto) {
    const {amount} = dollarOpsDto;
    this.logger.log(`Buy dollar called - N${amount}`);

    if(amount == 0) {
      throw new InvalidDepositAmountException();
    }

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
    const profile = await this.profileRepository.findOne({
      where: {user},
      select: ['pin']
    });

    if(profile.pin === 0) {
      this.logger.error(`Transaction pin has not been set`);
      throw new TransactionPinNotFoundException();
    }

    if(profile.pin !== pin){
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

  async findVaulter(usernameStub: string) {
    const user = await this.userRepository.findOne({
      where: { username: Like(`${usernameStub}`) },
      select: ['id', 'email', 'phoneNumber', 'firstname', 'lastname']
    });

    this.logger.log(`Find vaulter with username starting with '${usernameStub}'`);

    return user;
  }

  async getBalance(user: User) {
    this.logger.log(`Retrieve dollar balance...`);

    const savings = await this.dollarRepository.findOne({
      where: {user},
      select: ['balance']
    });

    if(!savings) {
      this.logger.error(`Dollar savings account not found`);
      throw new NotFoundException(`Dollar savings not found`);
    }

    this.logger.log(`Dollar balance sent.`)
    return {balance: savings.balance};
  }
}