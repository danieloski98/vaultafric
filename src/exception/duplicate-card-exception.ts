import { BadRequestException } from '@nestjs/common';

export class DuplicateCardException extends BadRequestException {
  constructor() {
    super(`Duplicate card found`);
  }
}