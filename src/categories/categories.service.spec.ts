import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { YnabService } from 'src/ynab/ynab.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        CategoriesService,
        {
          provide: YnabService,
          useValue: {
            getCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
