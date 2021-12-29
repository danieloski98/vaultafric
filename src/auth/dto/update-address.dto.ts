import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  street: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}