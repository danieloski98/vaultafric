import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UpdateAccountNameDto } from '../dto/update-accountName.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRepository } from '../repository/profile.repository';
import { UserRepository } from '../repository/user.repository';
import { UpdateAvatarDto } from '../dto/update-avatar.dto';

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

  async updateAccountName(user: User, updateAccountNameDto: UpdateAccountNameDto) {
    this.logger.log('Update user account name started');
    let profile = await this.getProfile(user) ?? this.repository.create({user});
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

    const {street, city, state, country} = updateAddress;
    let profile = await this.getProfile(user) ?? this.repository.create({user});

    profile.street = street;
    profile.city = city;
    profile.state = state;
    profile.country = country;

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

  async updateAvatar(user: User, updateAvatarDto: UpdateAvatarDto) {
    this.logger.log('Update avatar started');

    let profile = await this.getProfile(user) ?? this.repository.create({user});
    profile.avatar  = updateAvatarDto.avatar;
    await this.repository.save(profile);

    this.logger.log('Update avatar completed');
  }

}