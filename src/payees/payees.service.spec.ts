import { Test, TestingModule } from '@nestjs/testing';
import { PayeesService } from './payees.service';

describe('PayeesService', () => {
  let service: PayeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayeesService],
    }).compile();

    service = module.get<PayeesService>(PayeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
