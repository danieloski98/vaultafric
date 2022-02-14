import { BadRequestException } from '@nestjs/common';

export class EmailNotSentException extends BadRequestException {
  constructor() {
    super(undefined, `Email not sent. Please try again`);
  }
}