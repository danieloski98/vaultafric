import { NotFoundException } from '@nestjs/common';

export class CardNotFoundException extends NotFoundException {
  constructor() {
    super(`Card not found`);
  }
}