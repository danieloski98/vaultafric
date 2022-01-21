import { NotFoundException } from '@nestjs/common';

export class SavingsAccountNotFoundException extends NotFoundException {
  constructor() {
    super(undefined, `Savings account not found. Please try again`);
  }
}