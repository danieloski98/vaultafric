import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAccountNameDto {

  @IsNotEmpty()
  firstname: string;

  @IsOptional()
  othernames: string;

  @IsNotEmpty()
  lastname: string;
}