import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsUUID } from 'class-validator';
import { PaymentMethodsEnum } from '../payment-methods.enum';

export class NewUserInvestmentDto {
  @ApiProperty()
  @IsUUID()
  investment_id: string;

  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  savingsId: string;

  @ApiProperty()
  @IsOptional()
  card: string;

  @ApiProperty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsInt()
  unit: number;

  @ApiProperty()
  @IsInt()
  pin: number;

  @ApiProperty()
  @IsInt()
  interest: number;

  @ApiProperty()
  @IsIn([PaymentMethodsEnum.Card, PaymentMethodsEnum.SavingsAccount])
  paymentMethod: PaymentMethodsEnum;
}
