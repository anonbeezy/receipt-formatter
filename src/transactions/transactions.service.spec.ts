import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { CacheModule } from '@nestjs/cache-manager';
import { YnabService } from 'src/ynab/ynab.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        TransactionsService,
        {
          provide: YnabService,
          useValue: {
            createTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
