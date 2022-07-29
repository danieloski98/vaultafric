import { Length, Matches } from 'class-validator';

export class AddCardDto {
  name: string;

  number: number;

  @Length(4)
  @Matches(/[0-9]{2}\/[0-9]{2}$/, { message: `Invalid Expiry Date` })
  expiryDate: string;

  cvv: number;

  pin: number;
}
