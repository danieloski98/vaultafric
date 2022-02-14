import { NotFoundException } from '@nestjs/common';

export class JointSavingsNotFoundException extends NotFoundException {
  constructor() {
    super(undefined, `JointSavings account not found`);
  }
}