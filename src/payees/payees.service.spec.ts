import { Test, TestingModule } from '@nestjs/testing';
import { PayeesService } from './payees.service';
import { CacheModule } from '@nestjs/cache-manager';
import { YnabService } from 'src/ynab/ynab.service';

describe('PayeesService', () => {
  let service: PayeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        PayeesService,
        {
          provide: YnabService,
          useValue: {
            getPayees: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PayeesService>(PayeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
