import { EntityRepository, Repository } from 'typeorm';
import { JointSavingsEntity } from '../joint-savings.entity';
import { CreateJointSavingsDto } from '../dto/create-joint-savings.dto';
import { User } from '../../../auth/entity/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(JointSavingsEntity)
export class JointSavingsRepository extends Repository<JointSavingsEntity> {
  private readonly logger = new Logger(JointSavingsRepository.name, true);

  async saveJointSavingsAccount(createJointSavingsDto: CreateJointSavingsDto) {
    this.logger.log(`Save JointSavings Account: ${createJointSavingsDto.savingsName}`);

    const savingsAccount = this.create(createJointSavingsDto);
    await this.save(savingsAccount);
    return savingsAccount;
  }

  async exist(groupName: string, savingsName: string, user: User) {
    this.logger.log(`Find duplicate JointSavings...`);
    const count = await this.count({
      where: {groupName, savingsName, owner: user}
    });

    return count > 0;
  }

  async getJointSavings(user: User, groupId: string, fields: string[]) {

    return await this.findOne({
      where: {owner: user, id: groupId},
      relations: fields
    });
  }
}