import { EntityRepository, Repository } from 'typeorm';
import { JointSavingsParticipantsEntity } from '../joint-savings-participants.entity';
import { JointSavingsEntity } from '../joint-savings.entity';
import { User } from '../../../auth/entity/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(JointSavingsParticipantsEntity)
export class JointSavingsParticipantsRepository extends Repository<JointSavingsParticipantsEntity>{

  private readonly logger = new Logger(JointSavingsParticipantsRepository.name, true);

  async saveParticipants(jointSavings: JointSavingsEntity, tokenArray: string[], participants: User[]) {
    this.logger.log(`Save participants to database`);
    for (let i = 0; i < tokenArray.length; i++) {
      await this.save({ jointSavings, token: `${tokenArray[i]}`, user: participants[i] });
    }
  }

  async activateGroupSavings(token: string) {
    await this.createQueryBuilder()
      .update(JointSavingsParticipantsEntity)
      .set({ joinDate: new Date(), hasJoinedGroup: true })
      .where("token = :token", {token})
      .execute();
  }

}