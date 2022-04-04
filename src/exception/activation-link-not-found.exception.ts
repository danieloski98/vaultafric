import { NotFoundException } from '@nestjs/common';

export class ActivationLinkNotFoundException extends NotFoundException {
  constructor() {
    super(`Activation link not found`);
  }
}