import { JointSavings } from './entity/joint-savings.entity';
import { User } from '../../auth/entity/user.entity';

export interface JointSavingCreated {
  message: string,
  group?: JointSavings,
  successfulInvitations: {
    count: number,
    friends: User[]
  },
  failedInvitations: {
    count: number,
    friends: User[]
  }
}