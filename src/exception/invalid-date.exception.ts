import { BadRequestException } from '@nestjs/common';

export class InvalidDateException extends BadRequestException {
  constructor() {
    super(undefined, `Invalid start and end dates`);
  }
}