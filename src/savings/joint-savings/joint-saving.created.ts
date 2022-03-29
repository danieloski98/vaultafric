import { JointSavingsEntity } from './joint-savings.entity';
import { User } from '../../auth/entity/user.entity';

export interface JointSavingCreated {
  message: string,
  group?: JointSavingsEntity,
  successfulInvitations: {
    count: number,
    friends: User[]
  },
  failedInvitations: {
    count: number,
    friends: User[]
  }
}