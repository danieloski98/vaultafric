import { IsEmail } from 'class-validator';

export class DeleteUserAccountDto {
  @IsEmail()
  email: string;
}