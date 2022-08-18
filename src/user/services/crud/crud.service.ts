import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRepository } from 'src/auth/repository/profile.repository';
import { UserRepository } from 'src/auth/repository/user.repository';
// import { UserRepository } from 'src/auth/repository/user.repository';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(ProfileRepository) private profileRepo: ProfileRepository,
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  async getAllUSers() {
    // const users = await this.profileRepo.find({ relations: ['user'] });
    const users = await this.userRepo.find({
      relations: ['profile', 'investments'],
    });

    return {
      message: 'User found',
      data: users,
    };
  }
}
