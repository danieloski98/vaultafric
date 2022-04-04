import { BadRequestException } from '@nestjs/common';

export class ExpiredActivationLinkException extends BadRequestException{
  constructor() {
    super(`Activation link expired`)
  }
}