import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountNameDto {

  @IsString()
  @IsNotEmpty()
  firstname: string;

  othernames: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;
}