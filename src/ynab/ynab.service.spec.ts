import { Test, TestingModule } from '@nestjs/testing';
import { YnabService } from './ynab.service';
import { YNAB_API, YNAB_BUDGET_ID, YNAB_ACCOUNT_ID } from './constants';

describe('YnabService', () => {
  let service: YnabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YnabService,
        {
          provide: YNAB_API,
          useValue: {
            transactions: {
              createTransaction: jest.fn(),
            },
          },
        },
        {
          provide: YNAB_BUDGET_ID,
          useValue: '123',
        },
        {
          provide: YNAB_ACCOUNT_ID,
          useValue: '456',
        },
      ],
    }).compile();

    service = module.get<YnabService>(YnabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
