import { IsNotEmpty } from 'class-validator';

export class UpdateAccountNameDto {

  @IsNotEmpty()
  firstname: string;

  othernames: string;

  @IsNotEmpty()
  lastname: string;
}