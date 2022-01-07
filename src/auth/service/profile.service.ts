import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UpdateAccountNameDto } from '../dto/update-accountName.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRepository } from '../repository/profile.repository';
import { UserRepository } from '../repository/user.repository';
import { TransactionPinDto } from '../dto/transaction-pin.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(ProfileRepository)
    private repository: ProfileRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  private async getProfile(user: User) {
    this.logger.log('Get user profile')
    return await this.repository.findOne({where: {user}});
  }

  async getFullProfile(user: User): Promise<{}> {
    this.logger.log(`Get user complete profile`);

    const profileEntity = await this.repository.findOne({
      where: {user},
      relations: ['user']
    });

    const profile = {
      ...profileEntity,
      ...profileEntity.user
    };
    delete profile.user;

    return profile;
  }

  async updateAccountName(user: User, updateAccountNameDto: UpdateAccountNameDto) {
    this.logger.log('Update user account name started');
    let profile = await this.getProfile(user);

    const {firstname, lastname, othernames} = updateAccountNameDto;

    profile.otherNames = othernames;
    await this.repository.save(profile);

    user.firstname = firstname;
    user.lastname = lastname;

    await this.userRepository.save(user);
    this.logger.log('Update user account name completed');
  }

  async updateAddress(user: User, updateAddress: UpdateAddressDto) {
    this.logger.log('Update user address started');

    const profile = await this.getProfile(user);

    Object.keys(updateAddress).forEach(key => {
      profile[key] = updateAddress[key];
    });

    await this.repository.save(profile);

    this.logger.log('Update user address completed');
  }

  async updateContact(user: User, updateContactDto: UpdateContactDto) {
    this.logger.log('Update user contact started');

    user.phoneNumber = updateContactDto.phoneNumber;
    await this.userRepository.save(user);

    this.logger.log('Update user contact completed');
  }

  async updateEmail(user: User, updateEmailDto: UpdateEmailDto) {
    this.logger.log('Update user email started');

    user.email = updateEmailDto.email;
    await this.userRepository.save(user);

    this.logger.log('Update user email completed');
  }

  async updateAvatar(user: User, buffer: Buffer) {
    this.logger.log('Update user avatar');

    let profile = await this.getProfile(user);
    profile.avatar  = buffer.toString('base64');
    await this.repository.save(profile);

    this.logger.log('Update avatar completed');
  }

  async createProfile(user: User) {
    this.logger.log(`Create user profile`);
    const profile = this.repository.create({user});
    await this.repository.save(profile)
  }

  async updateTransactionPin(user: User, transactionPinDto: TransactionPinDto): Promise<{message: string}> {
    this.logger.log(`Update transaction pin...`);
    const {pin} = transactionPinDto;

    const profile = await this.repository.findOne({
      where: {user},
      select: ['id', 'pin']
    });

    if(!profile){
      throw new NotFoundException(`User not found`);
    }

    profile.pin = pin;
    await this.repository.save(profile)

    this.logger.log(`Transaction pin updated`);
    return {message: `Pin changed successfully`};
  }
}