import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TransferDollarDto } from './dto/transfer-dollar.dto';
import { User } from '../../auth/entity/user.entity';
import { UserRepository } from '../../auth/repository/user.repository';
import { Like } from 'typeorm';
import { DollarOpsDto } from './dto/dollar-ops.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DollarSavingsRepository } from './dollar-savings.repository';
import { ProfileRepository } from '../../auth/repository/profile.repository';
import { DollarToNairaDto } from './dto/dollar-to-naira.dto';

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

  async convertDollars(user: User, dollarToNairaDto: DollarToNairaDto): Promise<{message: string}> {
    this.logger.log(`Convert naira to dollars`);
    const {amount, pin} = dollarToNairaDto;

    this.logger.log(`Fetch user profile`)
    const profile = await this.profileRepository.findOne({
      where: {user},
      select: ['pin']
    });

    if(!profile) {
      throw new NotFoundException(`User not found`);
    }

    if(profile.pin !== pin){
      this.logger.error(`Invalid transaction pin`);
      throw new BadRequestException(`Invalid transaction pin`);
    }

    this.logger.log(`Fetch user dollar account...`);
    const dollarAccount = await this.dollarRepository.findOne({
      where: {user},
      select: ['id', 'balance']
    });

    if(dollarAccount.balance < amount) {
      this.logger.error(`Insufficient funds in dollar account`);
      throw new BadRequestException(`Insufficient funds in dollar account`);
    }

    // TODO: sync with 3rd party onepipe tool
    dollarAccount.balance -= amount;

    // TODO: Credit enter bank detail

    await this.dollarRepository.save(dollarAccount);


    return {message: `Your bank account has been credited`};
  }

  async transferDollar(transferDollarDto: TransferDollarDto): Promise<void> {
    this.logger.log(`Transfer dollar to vaulter - '${transferDollarDto.vaulter.firstname}'`);
    return Promise.resolve(undefined);
  }

  async findVaulter(usernameStub: string): Promise<User> {
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