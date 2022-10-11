import { Test, TestingModule } from '@nestjs/testing';
import { EmailserviceService } from './emailservice.service';

describe('EmailserviceService', () => {
  let service: EmailserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailserviceService],
    }).compile();

    service = module.get<EmailserviceService>(EmailserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
