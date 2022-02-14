import { Test, TestingModule } from '@nestjs/testing';
import { OnePipeService } from './one-pipe.service';

describe('OnepipeService', () => {
  let service: OnePipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnePipeService],
    }).compile();

    service = module.get<OnePipeService>(OnePipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
