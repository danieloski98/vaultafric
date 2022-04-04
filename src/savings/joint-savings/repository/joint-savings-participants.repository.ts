import { EntityRepository, Repository } from 'typeorm';
import { JointSavingsParticipants } from '../entity/joint-savings-participants.entity';
import { JointSavings } from '../entity/joint-savings.entity';
import { User } from '../../../auth/entity/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(JointSavingsParticipants)
export class JointSavingsParticipantsRepository extends Repository<JointSavingsParticipants>{

  private readonly logger = new Logger(JointSavingsParticipantsRepository.name, true);

  async saveParticipants(jointSavings: JointSavings, participants: User[]) {
    this.logger.log(`Save participants to database`);

    for (let i = 0; i < participants.length; i++) {
      await this.save({ jointSavings, user: participants[i] });
    }
  }

  async activateGroupSavings(user: User) {
    this.logger.log(`Activate group savings for '${user.id}'`);

    try{
      return await this.createQueryBuilder()
        .update(JointSavingsParticipants)
        .set({ hasJoinedGroup: true })
        .where("user = :user", { user: `f9cf2de0-7f91-4403-8f5a-9f179bf93744` })
        .execute();
    }catch(error) {
      this.logger.error('Could not perform update', error);
    }

  }

}