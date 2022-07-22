import { BadRequestException } from '@nestjs/common';

export class EmailInUserException extends BadRequestException {
  constructor() {
    super(`Email Already in use by another admin`);
  }
}