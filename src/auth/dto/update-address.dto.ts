import { IsNotEmpty } from 'class-validator';

export class UpdateAddressDto {
  @IsNotEmpty()
  country: string;

  street: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  city: string;
}