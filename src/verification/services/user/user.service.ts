import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse } from 'cloudinary';
import Cloudinary from 'src/common/utils';
import { ID_DTO } from 'src/verification/DTO/ID.DTO';
import { IDRepository } from 'src/verification/Repository/ID.repository';
import { ID_PicRepository } from 'src/verification/Repository/ID_Pic.repository';

@Injectable()
export class UserService {
  private logger = new Logger('VERIFICATION:USERSERVICE');
  constructor(
    @InjectRepository(IDRepository) private idRepo: IDRepository,
    @InjectRepository(ID_PicRepository) private picRepo: ID_PicRepository,
  ) {}

  async uploadIDNumber(user_id: string, item: ID_DTO) {
    const uploaded = await this.idRepo.find({ where: { user_id } });

    if (uploaded.length > 0) {
      throw new BadRequestException(`ID number already uploaded`);
    }

    const IDObj = await this.idRepo.create({
      user_id,
      type: item.type,
      num: item.id,
    });
    await this.idRepo.save(IDObj);

    return {
      message: 'ID number uploaded',
    };
  }

  async uploadIDImage(
    user_id: string,
    type: string,
    files: {
      front?: Express.Multer.File[];
      back?: Express.Multer.File[];
    },
  ) {
    const doc = await this.picRepo.findOne({ where: { user_id } });

    if (doc !== null || doc !== undefined) {
      throw new BadRequestException('Document has already been uploaded');
    }
    if (!files.back || !files.front) {
      throw new BadRequestException(
        'Must upload both front and back of the ID',
      );
    }
    let front: UploadApiResponse;
    let back: UploadApiResponse;
    if (files.front) {
      front = await Cloudinary.uploader.upload(files.front[0].path);
    }
    if (files.back) {
      back = await Cloudinary.uploader.upload(files.back[0].path);
    }

    const entry = await this.picRepo.create({
      user_id,
      back: back.secure_url,
      front: front.secure_url,
      type: type,
    });
    await this.picRepo.save(entry);
    return {
      message: 'File recieved',
      data: entry,
    };
  }
}
