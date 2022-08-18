import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInvestmentRepository } from './user-investment-repository';
import { NewUserInvestmentDto } from './dto/new-user-investment.dto';
import { User } from '../auth/entity/user.entity';
import { InvestmentRepository } from './investment-repository';
import { RegisterInvestmentDto } from './dto/register-investment.dto';
import { InvestmentNotFoundException } from 'src/exception/investment-not-found-exception';
import { DuplicateInvestmentException } from '../exception/duplicate-investment-exception';
import { InActiveInvestmentException } from '../exception/in-active-investment-exception';
import { InvalidInvestmentAmountException } from '../exception/invalid-investment-amount-exception';
import { TransactionPinMismatchException } from '../exception/transaction-pin-mismatch.exception';
import { PaymentMethodsEnum } from './payment-methods.enum';
import { SavingsService } from '../savings/savings.service';
import { ProfileService } from '../auth/service/profile.service';
import { SectorRepository } from './Repository/Secotor.repository';
import Cloudinary from 'src/common/utils';
import { join } from 'path';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name, true);

  constructor(
    @InjectRepository(UserInvestmentRepository)
    private userInvestmentRepository: UserInvestmentRepository,

    @InjectRepository(InvestmentRepository)
    private investmentRepository: InvestmentRepository,

    @InjectRepository(SectorRepository) private sectorRepo: SectorRepository,

    private savingsService: SavingsService,
    private profileService: ProfileService,
  ) {}

  async invest(user: User, newUserInvestmentDto: NewUserInvestmentDto) {
    const {
      investment_id,
      user_id,
      amount,
      unit,
      pin,
      paymentMethod,
      interest,
      savingsId,
    } = newUserInvestmentDto;
    const investment = await this.getInvestmentById(investment_id);

    // throw exception if investment is inactive
    if (!investment.isActive) {
      this.logger.error(`Inactive investment selected`);
      throw new InActiveInvestmentException();
    }

    // throw exception if amount is 0
    if (amount === 0) {
      this.logger.log(`Invalid investment amount entered`);
      throw new InvalidInvestmentAmountException();
    }

    const existingInvestment = await this.userInvestmentRepository.findOne({
      where: { user, investment },
    });

    // throw exception if duplicate investment
    if (existingInvestment) {
      this.logger.error(`Duplicate investment`);
      throw new DuplicateInvestmentException();
    }

    const { transactionPin } = await this.profileService.getPin(user);
    // throw exception if pin does not match
    if (transactionPin !== pin) {
      this.logger.error(`Transaction pin mismatch`);
      throw new TransactionPinMismatchException();
    }

    // TODO: Get the money from the prefer method of payment, do a debit
    // withdraw money from savings account

    this.logger.log(`Payment method selected '${paymentMethod}'`);
    if (paymentMethod == PaymentMethodsEnum.SavingsAccount) {
      // this.logger.log(`Withdraw ${amount} from ${user.id} account`);
      await this.savingsService.withdraw(user, savingsId, amount);
    } else {
      // TODO: Withdraw from card
    }

    const userInvestment = this.userInvestmentRepository.create({
      investment_id,
      interest,
      user_id,
      amount,
      unit,
      paymentMethod,
      savingsId,
    });
    await this.userInvestmentRepository.save(userInvestment);

    return { message: `Investment into ${investment.title} was successful` };
  }

  async getInvestmentById(id: string) {
    this.logger.log(`Get investment detail: ${id}`);
    const investment = this.investmentRepository.findOne({ where: { id } });

    if (!investment) {
      this.logger.error(`Investment not found`);
      throw new InvestmentNotFoundException();
    }

    this.logger.log(`Get investment completed`);
    return investment;
  }

  async getAllInvestments() {
    this.logger.log(`Get all investments`);
    const investments = await this.investmentRepository.find({
      where: { isActive: true },
      select: [
        'id',
        'roi',
        'title',
        'owners',
        'units',
        'picture',
        'isActive',
        'price',
        'description',
        'duration',
        'riskLevel',
        'start',
        'end',
      ],
    });
    return {
      message: 'Active Investments',
      data: investments,
    };
  }

  async getAllDraftsInvestments() {
    this.logger.log(`Get all investments`);
    const investments = await this.investmentRepository.find({
      where: { isActive: false },
      select: [
        'id',
        'roi',
        'title',
        'owners',
        'units',
        'picture',
        'isActive',
        'price',
        'description',
        'duration',
        'riskLevel',
        'start',
        'end',
      ],
    });
    return {
      message: 'Inactive Investments',
      data: investments,
    };
  }

  async createInvestment(
    registerInvestmentDto: RegisterInvestmentDto,
    picture?: Buffer,
  ) {
    this.logger.log(`Register new investment`);

    const investment = this.investmentRepository.create({
      ...registerInvestmentDto,
    });

    if (picture) {
      this.logger.log(`picture found...converting to base64`);
      investment.picture = picture.toString('base64');
    }
    //
    this.logger.log(`New investment created`);
    await this.investmentRepository.save(investment);

    return { message: `New investment saved` };
  }

  async createSector(sector: string) {
    const sec = sector.toLowerCase();
    const sec_exist = await this.sectorRepo.find({
      where: { sector: sec },
    });

    if (sec_exist.length > 0) {
      throw new BadRequestException('Secotr with that name already exisits');
    }

    const new_sector = await this.sectorRepo.create({ sector: sec });
    await this.sectorRepo.save(new_sector);

    return {
      message: 'Sector created',
      data: new_sector,
    };
  }

  async getAllSectors() {
    const sectors = await this.sectorRepo.find();
    this.logger.error('My Secotrs');
    return {
      message: 'sector found',
      data: sectors,
    };
  }

  async uploadInvestmentPicture(id: string, file: Express.Multer.File) {
    const investment = await this.investmentRepository.find({
      where: { id },
    });

    if (investment.length < 1) {
      throw new BadRequestException('Investment with id not found');
    }

    this.logger.log(file);
    const image = await Cloudinary.uploader.upload(
      join(process.cwd(), file.path),
    );

    await this.investmentRepository.update(
      { id },
      { picture: image.secure_url },
    );
    return {
      message: 'Investment picture updated',
    };
  }
}
