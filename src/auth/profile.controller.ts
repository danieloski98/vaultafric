import { Body, Controller, HttpCode, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { AccountConfirmedGuard } from './guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateAccountNameDto } from './dto/update-accountName.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetUser } from './get-user-decorator';
import { User } from './entity/user.entity';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ProfileService } from './service/profile.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('profile')
export class ProfileController {

  constructor(private profileService: ProfileService) {}

  @HttpCode(200)
  @Patch('account/name')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  updateAccountName(@GetUser() user: User, @Body(ValidationPipe) updateAccountNameDto: UpdateAccountNameDto): Promise<void> {
    return this.profileService.updateAccountName(user, updateAccountNameDto);
  }

  @HttpCode(200)
  @Patch('address')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  updateAddress(@GetUser() user: User, @Body(ValidationPipe) updateAddress: UpdateAddressDto): Promise<void> {
    return this.profileService.updateAddress(user, updateAddress);
  }

  @HttpCode(200)
  @Patch('contact')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  updateContact(@GetUser() user: User, @Body(ValidationPipe) updateContactDto: UpdateContactDto): Promise<void> {
    return this.profileService.updateContact(user, updateContactDto);
  }


  @HttpCode(200)
  @Patch('email')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  updateEmail(@GetUser() user: User, @Body(ValidationPipe) updateEmailDto: UpdateEmailDto): Promise<void> {
    return this.profileService.updateEmail(user, updateEmailDto);
  }

  @HttpCode(200)
  @Patch('avatar')
  @UseGuards(AccountConfirmedGuard)
  @UseGuards(AuthGuard('jwt'))
  updateAvatar(@GetUser() user: User, @Body(ValidationPipe) updateAvatarDto: UpdateAvatarDto): Promise<void> {
    return this.profileService.updateAvatar(user, updateAvatarDto);
  }

}