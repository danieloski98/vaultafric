import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IDRepository } from 'src/verification/Repository/ID.repository';
import { ID_PicRepository } from 'src/verification/Repository/ID_Pic.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';

@Injectable()
export class AdminService {
  private logger = new Logger('VERIFICATION:ADMINSERVICE');
  constructor(
    @InjectRepository(IDRepository) private idRepo: IDRepository,
    @InjectRepository(ID_PicRepository) private picRepo: ID_PicRepository,
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  async getAllNumbers() {
    const numbers = await this.idRepo.find();
    return {
      message: 'All ids',
      data: numbers,
    };
  }

  async getAllImages() {
    const images = await this.picRepo.find();
    return {
      message: 'All ids',
      data: images,
    };
  }

  async getUserNumber(user_id: string) {
    const id = await this.idRepo.findOne({ where: { user_id } });
    if (id === null || id === undefined) {
      throw new BadRequestException('No record found for this user');
    }

    return {
      message: 'Record found',
      data: id,
    };
  }

  async getUserImage(user_id: string) {
    const id = await this.picRepo.findOne({ where: { user_id } });
    if (id === null || id === undefined) {
      throw new BadRequestException('No record found for this user');
    }

    return {
      message: 'Record found',
      data: id,
    };
  }

  async approvedNumber(id: string) {
    const entry = await this.idRepo.findOne({ where: { id } });
    if (entry === null || entry === undefined) {
      throw new BadRequestException('No record found for this user');
    }
    await this.userRepo.update({ id: entry.user_id }, { isIDVerified: true });
    return {
      message: 'ID Number approved',
    };
  }

  async approvedImage(id: string) {
    const entry = await this.picRepo.findOne({ where: { id } });
    if (entry === null || entry === undefined) {
      throw new BadRequestException('No record found for this user');
    }
    await this.userRepo.update(
      { id: entry.user_id },
      { isIDPicVerified: true },
    );
    return {
      message: 'ID Number approved',
    };
  }

  async deleteNumber(id: string) {
    const entry = await this.idRepo.findOne({ where: { id } });
    if (entry === null || entry === undefined) {
      throw new BadRequestException('No record found for this user');
    }
    await this.idRepo.delete({ id });
    return {
      message: 'ID Number did not meet out recommendation so it was deleted',
    };
  }

  async deleteImage(id: string) {
    const entry = await this.picRepo.findOne({ where: { id } });
    if (entry === null || entry === undefined) {
      throw new BadRequestException('No record found for this user');
    }
    await this.picRepo.delete({ id });
    return {
      message: 'ID did not meet out recommendation so it was deleted',
    };
  }
}
