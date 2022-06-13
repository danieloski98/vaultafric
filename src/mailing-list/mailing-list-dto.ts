import { IsEmail, IsString, IsDateString } from 'class-validator';

export class MailingListDto {
  @IsString()
  id: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsDateString()
  createdAt: string;
}
