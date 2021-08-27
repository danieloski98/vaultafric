import * as meaningfulString from 'meaningful-string';

const otpOptions = {
  min: 6,
  max: 6,
  onlyNumbers: true,
}

export function generateOTP(): string {
  return meaningfulString.random(otpOptions);
}