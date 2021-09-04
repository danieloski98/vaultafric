import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { User } from '../../../auth/entity/user.entity';

export class TransferDollarDto {

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  vaulter: User;
}