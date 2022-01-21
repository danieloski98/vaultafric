import { BadRequestException, NotFoundException } from '@nestjs/common';

export class DuplicateFixedDepositException extends BadRequestException {
  constructor() {
    super(undefined, `Duplicate entry for Fixed Deposit`);
  }
}

export class FixedDepositNotFoundException extends NotFoundException {
  constructor() {
    super(undefined, `Fixed deposit savings not found`);
  }
}