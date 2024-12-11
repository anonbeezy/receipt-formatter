import { Test, TestingModule } from '@nestjs/testing';
import { YnabService } from './ynab.service';

describe('YnabService', () => {
  let service: YnabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YnabService],
    }).compile();

    service = module.get<YnabService>(YnabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
