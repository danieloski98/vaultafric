import { IsNumber, IsString, Length, Matches } from 'class-validator';

export class AddCardDto {
  @IsString()
  name: string;

  @IsNumber({maxDecimalPlaces: 0}, {message: `Invalid card number`})
  number: number;

  @IsString()
  @Length(4)
  @Matches(/[0-9]{2}\/[0-9]{2}$/, {message: `Invalid Expiry Date`})
  expiryDate: string;

  @IsNumber({maxDecimalPlaces: 0})
  cvv: number;

  @IsNumber({maxDecimalPlaces: 0})
  pin: number;
}