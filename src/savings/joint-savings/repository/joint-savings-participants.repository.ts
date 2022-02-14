import { EntityRepository, Repository } from 'typeorm';
import { JointSavingsParticipantsEntity } from '../joint-savings-participants.entity';
import { JointSavingsEntity } from '../joint-savings.entity';
import { User } from '../../../auth/entity/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(JointSavingsParticipantsEntity)
export class JointSavingsParticipantsRepository extends Repository<JointSavingsParticipantsEntity>{

  private readonly logger = new Logger(JointSavingsParticipantsRepository.name, true);

  async saveParticipants(jointSavings: JointSavingsEntity, token: string, participants: User[]) {
    await participants.forEach(participant => {
      this.logger.log(`Verify user exist...`);

      this.save({
        jointSavings, token,
        user: participant
      });
    });
  }

  async activateGroupSavings(user: User, token: string) {
    await this.createQueryBuilder()
      .update(JointSavingsParticipantsEntity)
      .set({ joinDate: new Date(), hasJoinedGroup: true })
      .where("token = :token", {token})
      .execute();
  }

}