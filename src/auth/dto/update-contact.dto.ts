import { IsNotEmpty } from 'class-validator';

export class UpdateContactDto {
  // TODO: Verify using regex
  @IsNotEmpty()
  phoneNumber: string;
}