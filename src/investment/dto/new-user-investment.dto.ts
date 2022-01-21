import { IsIn, IsInt, IsOptional, IsUUID } from 'class-validator';
import { PaymentMethodsEnum } from '../payment-methods.enum';

export class NewUserInvestmentDto {

  @IsUUID()
  investmentId: string;

  @IsUUID()
  @IsOptional()
  savingsId: string;

  @IsOptional()
  card: string;

  @IsInt()
  amount: number;

  @IsInt()
  unit: number;

  @IsInt()
  pin: number;

  @IsIn([PaymentMethodsEnum.Card, PaymentMethodsEnum.SavingsAccount])
  paymentMethod: PaymentMethodsEnum;
}