import { BadRequestException } from '@nestjs/common';

export class TransactionPinMismatchException extends BadRequestException {
  constructor() {
    super(undefined, `Invalid transaction pin`);
  }
}