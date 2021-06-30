import { User } from '../../auth/user.entity';

export interface Plan {
  start: Date;
  end: Date;
  name: string;
  balance: number;
  occurrence: SavingsOccurrence;
  user: User;
}

export enum SavingsOccurrence {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}