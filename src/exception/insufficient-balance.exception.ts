import { BadRequestException } from '@nestjs/common';

export class InsufficientBalanceException extends BadRequestException {
  constructor() {
    super(undefined, `Insufficient balance`);
  }
}