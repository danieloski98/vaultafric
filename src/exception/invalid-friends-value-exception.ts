import { BadRequestException } from '@nestjs/common';

export class InvalidFriendsValueException extends BadRequestException {
  constructor() {
    super(`Invalid friends value`);
  }
}