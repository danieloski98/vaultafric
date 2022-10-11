import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AccountConfirmedGuard } from '../guard/accountConfirmed.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateAccountNameDto } from '../dto/update-accountName.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { GetUser } from '../get-user-decorator';
import { User } from '../entity/user.entity';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { ProfileService } from '../service/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionPinDto } from '../dto/transaction-pin.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@UseGuards(AccountConfirmedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiTags('USER')
  @ApiBody({ type: UpdateAccountNameDto })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateAccountNameDto })
  @Patch('account/name')
  updateAccountName(
    @GetUser() user: User,
    @Body(ValidationPipe) updateAccountNameDto: UpdateAccountNameDto,
  ) {
    return this.profileService.updateAccountName(user, updateAccountNameDto);
  }

  @ApiTags('USER')
  @ApiBody({ type: UpdateAddressDto })
  @HttpCode(HttpStatus.OK)
  @Patch('address')
  updateAddress(
    @GetUser() user: User,
    @Body(ValidationPipe) updateAddress: UpdateAddressDto,
  ) {
    return this.profileService.updateAddress(user, updateAddress);
  }

  @ApiTags('USER')
  @ApiBody({ type: UpdateContactDto })
  @HttpCode(HttpStatus.OK)
  @Patch('contact')
  updateContact(
    @GetUser() user: User,
    @Body(ValidationPipe) updateContactDto: UpdateContactDto,
  ) {
    return this.profileService.updateContact(user, updateContactDto);
  }

  @ApiTags('USER')
  @ApiBody({ type: UpdateEmailDto })
  @HttpCode(HttpStatus.OK)
  @Patch('email')
  updateEmail(
    @GetUser() user: User,
    @Body(ValidationPipe) updateEmailDto: UpdateEmailDto,
  ) {
    return this.profileService.updateEmail(user, updateEmailDto);
  }

  @ApiTags('USER')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('avatar')
  updateAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateAvatar(user, file);
  }

  @ApiTags('USER')
  @ApiBody({ type: TransactionPinDto })
  @HttpCode(HttpStatus.OK)
  @Patch('pin')
  updateTransactionPin(
    @GetUser() user: User,
    @Body(ValidationPipe) transactionPinDto: TransactionPinDto,
  ) {
    return this.profileService.updateTransactionPin(user, transactionPinDto);
  }

  @ApiTags('USER')
  @Get('all')
  getAllUsers() {
    return this.profileService.getAllUsers();
  }

  @ApiTags('USER')
  @Get()
  getProfile(@GetUser() user: User) {
    return this.profileService.getFullProfile(user);
  }
}
