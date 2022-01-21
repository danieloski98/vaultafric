import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInvestmentRepository } from './user-investment-repository';
import { NewUserInvestmentDto } from './dto/new-user-investment.dto';
import { User } from '../auth/entity/user.entity';
import { InvestmentRepository } from './investment-repository';
import { RegisterInvestmentDto } from './dto/register-investment.dto';
import { InvestmentNotFoundException } from 'src/exception/investment-not-found-exception';
import { ProfileRepository } from '../auth/repository/profile.repository';
import { DuplicateInvestmentException } from '../exception/duplicate-investment-exception';
import { InActiveInvestmentException } from '../exception/in-active-investment-exception';
import { InvalidInvestmentAmountException } from '../exception/invalid-investment-amount-exception';
import { TransactionPinMismatchException } from '../exception/transaction-pin-mismatch.exception';
import { PaymentMethodsEnum } from './payment-methods.enum';
import { FixedDepositRepository } from '../savings/fixed-deposit/fixed-deposit.repository';
import { FixedSavingsRepository } from '../savings/fixed-savings/fixed-savings.repository';
import { InsufficientBalanceException } from '../exception/insufficient-balance.exception';
import { SavingsAccountNotFoundException } from '../exception/savings-account-not-found-exception';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name, true);

  constructor(
    @InjectRepository(UserInvestmentRepository)
    private userInvestmentRepository: UserInvestmentRepository,

    @InjectRepository(InvestmentRepository)
    private investmentRepository: InvestmentRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,

    @InjectRepository(FixedDepositRepository)
    private fixedDepositRepository: FixedDepositRepository,

    @InjectRepository(FixedSavingsRepository)
    private fixedSavingsRepository: FixedSavingsRepository
  ) {}

  async invest(user: User, newUserInvestmentDto: NewUserInvestmentDto) {
    const { investmentId, amount, unit, pin, paymentMethod, savingsId } = newUserInvestmentDto;
    const investment = await this.getInvestmentById(investmentId);

    if(amount === 0) {
      this.logger.log(`Invalid investment amount entered`);
      throw new InvalidInvestmentAmountException();
    }

    const existingInvestment = await this.userInvestmentRepository.findOne({
      where: {user, investment}
    });

    if(existingInvestment) {
      this.logger.error(`Duplicate investment`);
      throw new DuplicateInvestmentException();
    }

    if(!investment.isActive) {
      this.logger.error(`Inactive investment selected`);
      throw new InActiveInvestmentException();
    }

    const profile = await this.profileRepository.findOne({
      where: {user},
      select: ['id', 'pin']
    })

    if(profile.pin !== pin) {
      this.logger.error(`Transaction pin mismatch`);
      throw new TransactionPinMismatchException();
    }

    // TODO: Get the money from the prefer method of payment, do a debit
    if(paymentMethod == PaymentMethodsEnum.SavingsAccount) {

      // const account = await this.getSavings(savingsId);
      // if(!account) {
      //   throw new SavingsAccountNotFoundException();
      // }
      //
      // if(account.balance < amount) {
      //   this.logger.error(`Insufficient balance`);
      //   throw new InsufficientBalanceException();
      // }
    }

    return this.userInvestmentRepository.create({investment,  user, amount, unit, paymentMethod});

    // try {
    //   return await this.userInvestmentRepository.save(userInvestment);
    // }catch(err) {
    //   this.logger.error(err);
    //   throw new BadRequestException('Could not complete investment process. Please try again later.')
    // }
  }

  async getInvestmentById(id: string) {
    this.logger.log(`Get investment detail: ${id}`)
    const investment = this.investmentRepository.findOne({ where: { id } });

    if(!investment) {
      this.logger.error(`Investment not found`);
      throw new InvestmentNotFoundException();
    }

    this.logger.log(`Get investment completed`);
    return investment;
  }

  async getAllInvestments() {
    this.logger.log(`Get all investments`);
    return await this.investmentRepository.find({
      select: ['id', 'roi', 'title', 'owners', 'units', 'avatar', 'isActive']
    });
  }

  async createInvestment(registerInvestmentDto: RegisterInvestmentDto, avatar?: Buffer) {
    this.logger.log(`Register new investment`);

    const investment = this.investmentRepository.create({...registerInvestmentDto});

    if(avatar) {
      this.logger.log(`Avatar found...converting to base64`);
      investment.avatar = avatar.toString('base64');
    }
    //
    this.logger.log(`New investment created`);
    await this.investmentRepository.save(investment);

    return {message: `New investment saved`};
  }

  private async getSavings(savingsId: string) {
    let savingsAccount;

    savingsAccount = await this.fixedSavingsRepository.findOne({where: {id: savingsId}, select: ['id', 'balance']});
    if(!savingsAccount) savingsAccount = await this.fixedDepositRepository.findOne({where: {id: savingsId}, select: ['id', 'balance']});

    return savingsAccount;
  }

}