import { IsBase64, IsNotEmpty } from 'class-validator';

export class UpdateAvatarDto {
  @IsNotEmpty()
  avatar: string; // buffer
}