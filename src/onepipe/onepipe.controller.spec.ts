import { Test, TestingModule } from '@nestjs/testing';
import { OnePipeController } from './onepipe.controller';

describe('InvestmentController', () => {
  let controller: OnePipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnePipeController],
    }).compile();

    controller = module.get<OnePipeController>(OnePipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
