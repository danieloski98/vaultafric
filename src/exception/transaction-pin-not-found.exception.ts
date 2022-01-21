import { NotFoundException } from '@nestjs/common';

export class TransactionPinNotFoundException extends NotFoundException {
  constructor() {
    super(undefined, `Your transaction pin is not set`);
  }
}