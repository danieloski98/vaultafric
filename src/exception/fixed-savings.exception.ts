import { BadRequestException, NotFoundException } from '@nestjs/common';

export class FixedSavingsDeleteException extends BadRequestException {
  constructor() {
    super(undefined, `Cannot delete an active Fixed Savings plan`);
  }
}

export class DuplicateFixedSavingsException extends BadRequestException {
  constructor() {
    super(undefined, `Duplicate entry for Fixed Savings`);
  }
}

export class FixedSavingsNotFoundException extends NotFoundException {
  constructor() {
    super(undefined, `Fixed Savings not found`);
  }
}