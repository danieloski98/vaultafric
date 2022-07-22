import { UsercheckGuard } from './usercheck.guard';

describe('UsercheckGuard', () => {
  it('should be defined', () => {
    expect(new UsercheckGuard()).toBeDefined();
  });
});
